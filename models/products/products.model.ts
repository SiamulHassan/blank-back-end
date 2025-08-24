import mongoose, { Schema } from 'mongoose';
import variationSchema from './variationSchema.js';

const discountTierSchema = new Schema(
	{
		minQuantity: { type: Number, required: true }, // e.g., 100
		discountType: {
			type: String,
			enum: ['percentage', 'flat'],
			default: 'percentage',
		},
		discountValue: { type: Number, required: true }, // e.g., 10% or 500 flat
	},
	{ _id: false }
);
interface IProduct extends mongoose.Document {
	name: string;
	shortDescription?: string;
	description?: string;
	category: mongoose.Types.ObjectId;
	brand?: mongoose.Types.ObjectId;
	images?: string[];
	image?: string;
	stock: number;
	damage?: number;
	lowStockAlert?: number;
	variations?: any[]; // You can replace 'any' with your variation type if available
	cost: number;
	price: number;
	discountTiers?: any[];
	slug?: string;
	tags?: string[];
	meta?: {
		title?: string;
		description?: string;
		keywords?: string[];
		image?: string;
	};
	metaKeywords?: string[];
	metaImage?: string;
	isFeatured?: boolean;
	isVisible?: boolean;
	status?: string;
	customAttributes?: { label: string; value: string }[];
	faq?: { question: string; answer: string }[];
	vat?: number;
	isDeleted?: boolean;
	[key: string]: any;
}

const schema = new Schema<IProduct>(
	{
		name: { type: String, required: true, trim: true },
		shortDescription: { type: String, trim: true },
		description: { type: String },
		category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
		brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
		images: [String],
		image: String,

		// Global stock for simple products (when no variations exist)
		stock: { type: Number, default: 0 },
		damage: { type: Number, default: 0 },
		lowStockAlert: { type: Number, default: 0 }, //

		// Product variations with warehouse inventory
		variations: [variationSchema],

		// Base pricing
		cost: { type: Number, required: true, default: 0 }, // costPrice - buying cost
		price: { type: Number, required: true }, // base selling price

		// Bulk discounts
		discountTiers: [discountTierSchema], // n

		// SEO + Marketing
		slug: { type: String, trim: true, lowercase: true },
		tags: [String],
		meta: {
			title: String,
			description: String,
			keywords: [String],
			image: String,
		},
		metaKeywords: [String],
		metaImage: String,
		// Flags
		isFeatured: { type: Boolean, default: false },
		isVisible: { type: Boolean, default: true },
		status: {
			type: String,
			enum: ['draft', 'published', 'archived'],
			default: 'draft',
		},

		// Extra / Flexible attributes
		customAttributes: [
			{
				label: String,
				value: String,
			},
		],
		faq: [
			{
				question: String,
				answer: String,
			},
		],
		vat: { type: Number, default: 0 },
		isDeleted: { type: Boolean },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

/* =========================== 
   🔹 Virtuals 
   =========================== */

// In stock check (considering warehouse inventory)
schema.virtual('inStock').get(function () {
	if (this.variations?.length) {
		return this.variations.some((v: any) =>
			v.warehouseInventory?.some((inv: any) => inv.stock > 0)
		);
	}
	return this.stock > 0;
});

// Total stock across all warehouses
schema.virtual('totalStock').get(function () {
	let total = this.stock; // global stock for simple products

	if (this.variations?.length) {
		total += this.variations.reduce((sum, variation) => {
			const variationStock =
				variation.warehouseInventory?.reduce(
					(invSum: any, inv: any) => invSum + inv.stock,
					0
				) || 0;
			return sum + variationStock;
		}, 0);
	}

	return total;
});

// Get stock by warehouse
schema.virtual('stockByWarehouse').get(function () {
	const warehouseStock: { [key: string]: number } = {};

	if (this.variations?.length) {
		this.variations.forEach(variation => {
			variation.warehouseInventory?.forEach((inv: any) => {
				const warehouseId: string = inv.warehouse.toString();
				if (!warehouseStock[warehouseId]) {
					warehouseStock[warehouseId] = 0;
				}
				warehouseStock[warehouseId] += inv.stock;
			});
		});
	}

	return warehouseStock;
});

// Inventory cost valuation
schema.virtual('inventoryCostValue').get(function () {
	let value = this.costPrice * this.stock;

	if (this.variations?.length) {
		value += this.variations.reduce((sum, variation) => {
			const variationCost = variation.cost || this.costPrice;
			const variationStock =
				variation.warehouseInventory?.reduce(
					(invSum: any, inv: any) => invSum + inv.stock,
					0
				) || 0;
			return sum + variationCost * variationStock;
		}, 0);
	}

	return value;
});

// Inventory potential selling value
schema.virtual('inventorySellValue').get(function () {
	let value = this.sellingPrice * this.stock;

	if (this.variations?.length) {
		value += this.variations.reduce((sum, variation) => {
			const variationPrice = variation.price || this.sellingPrice;
			const variationStock =
				variation.warehouseInventory?.reduce(
					(invSum: any, inv: any) => invSum + inv.stock,
					0
				) || 0;
			return sum + variationPrice * variationStock;
		}, 0);
	}

	return value;
});

/* =========================== 
   🔹 Instance Methods 
   =========================== */

// Get available variations for a specific warehouse
schema.methods.getAvailableVariationsForWarehouse = function (
	warehouseId: any
) {
	return this.variations.filter((variation: any) =>
		variation.warehouseInventory?.some(
			(inv: any) =>
				inv.warehouse.toString() === warehouseId.toString() && inv.stock > 0
		)
	);
};

// Get stock for a specific variation and warehouse
schema.methods.getVariationWarehouseStock = function (
	variationId: any,
	warehouseId: any
) {
	const variation = this.variations.id(variationId);
	if (!variation) return 0;

	const inventory = variation.warehouseInventory?.find(
		(inv: any) => inv.warehouse.toString() === warehouseId.toString()
	);

	return inventory ? inventory.stock : 0;
};

/* =========================== 
   🔹 Middleware 
   =========================== */

// Slug middleware
schema.pre('save', function (next) {
	if (!this.slug && this.name) {
		this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
	}

	// Cast string numbers in variations
	if (this.variations?.length) {
		this.variations.forEach(variation => {
			if (typeof variation.price === 'string')
				variation.price = Number(variation.price);
			if (typeof variation.cost === 'string')
				variation.cost = Number(variation.cost);

			// Cast warehouse inventory numbers
			if (variation.warehouseInventory?.length) {
				variation.warehouseInventory.forEach((inv: any) => {
					if (typeof inv.stock === 'string') inv.stock = Number(inv.stock);
					if (typeof inv.reservedStock === 'string')
						inv.reservedStock = Number(inv.reservedStock);
					if (typeof inv.lowStockAlert === 'string')
						inv.lowStockAlert = Number(inv.lowStockAlert);
				});
			}
		});
	}

	next();
});

const Product = mongoose.model<any>('Product', schema);
export default Product;

export { default as settings } from './products.settings.js';
