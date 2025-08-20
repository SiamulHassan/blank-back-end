import mongoose, { Schema } from 'mongoose';
import variationSchema from './productVariation.js';


// Discount tiers schema (for bulk warehouse discounts)
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

const productSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		shortDescription: { type: String, trim: true },
		description: { type: String },

		category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
		brand: { type: Schema.Types.ObjectId, ref: 'Brand' },

		images: [String],
		mainImage: String,

		// Global stock for simple products (variations also have their own stock)
		stock: { type: Number, default: 0, required: true },
		damage: { type: Number, default: 0 },
		lowStockAlert: { type: Number, default: 0 },

		// Variations (each has own stock, price, cost, attributes)
		variations: [variationSchema],

		// Base pricing
		costPrice: { type: Number, required: true, default: 0 }, // buying cost
		sellingPrice: { type: Number, required: true }, // base selling price

		// Bulk discounts
		discountTiers: [discountTierSchema],

		// SEO + Marketing
		slug: { type: String, trim: true, lowercase: true },
		tags: [String],
		meta: {
			title: String,
			description: String,
			keywords: [String],
			image: String,
		},

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

// In stock check
productSchema.virtual('inStock').get(function () {
	return this.stock > 0 || this.variations.some((v: any) => v.stock > 0);
});

// Total stock (global + variations)
productSchema.virtual('totalStock').get(function () {
	let total = this.stock;
	if (this.variations?.length) {
		total += this.variations.reduce((sum: number, v: any) => sum + v.stock, 0);
	}
	return total;
});

// Inventory cost valuation
productSchema.virtual('inventoryCostValue').get(function () {
	let value = this.costPrice * this.stock;
	if (this.variations?.length) {
		value += this.variations.reduce(
			(sum: number, v: any) => sum + (v.cost || this.costPrice) * v.stock,
			0
		);
	}
	return value;
});

// Inventory potential selling value
productSchema.virtual('inventorySellValue').get(function () {
	let value = this.sellingPrice * this.stock;
	if (this.variations?.length) {
		value += this.variations.reduce(
			(sum: number, v: any) => sum + (v.price || this.sellingPrice) * v.stock,
			0
		);
	}
	return value;
});

/* ===========================
   🔹 Middleware
=========================== */

// Slug middleware
productSchema.pre('save', function (next) {
	if (!this.slug && this.name) {
		this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
	}

	// Cast string numbers in variations (since variationSchema pre('save') won’t fire for subdocs)
	if (this.variations?.length) {
		this.variations.forEach((v: any) => {
			if (typeof v.price === 'string') v.price = Number(v.price);
			if (typeof v.cost === 'string') v.cost = Number(v.cost);
			if (typeof v.stock === 'string') v.stock = Number(v.stock);
		});
	}

	next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;

export { default as settings } from './products.settings.js';
