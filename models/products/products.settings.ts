import { ProductSettings } from './products.types.js';
import Category from '../category/category.model.js';
import Brand from '../brand/brand.model.js';
import Collection from '../collection/collection.model.js';
const settings: any = {
	name: {
		type: 'string',
		required: true,
		title: 'Name',
		edit: true,
		search: true,
		unique: true,
	},

	shortDescription: {
		type: 'string',
		title: 'Short Description',
		edit: true,
	},

	description: {
		type: 'string',
		title: 'Long Description',
		edit: true,
	},

	category: {
		edit: true,
		sort: true,
		title: 'Category',
		type: 'string',
		required: true,
		populate: {
			path: 'category',
			select: 'name',
		},
		filter: {
			name: 'category',
			field: 'category_in',
			type: 'multi-select',
			label: 'Category',
			title: 'Sort by Category',
			model: Category,
			key: 'name',
		},
	},

	brand: {
		edit: true,
		sort: true,
		title: 'Brand',
		type: 'string',
		populate: {
			path: 'brand',
			select: 'name',
		},
		filter: {
			name: 'brand',
			field: 'brand_in',
			type: 'multi-select',
			label: 'Brand',
			title: 'Sort by Brand',
			model: Brand,
			key: 'name',
		},
	},

	image: {
		type: 'uri',
		title: 'Thumbnail',
		edit: true,
	},
	images: {
		type: 'array-string',
		title: 'Images',
		edit: true,
	},

	// Stock (global)
	stock: {
		type: 'number',
		title: 'Stock',
		edit: true,
		sort: true,
		filter: {
			name: 'stock',
			field: 'stock',
			type: 'range',
			label: 'Stock',
		},
	},
	damage: {
		type: 'number',
		title: 'Damage',
		edit: true,
		sort: true,
	},
	lowStockAlert: {
		type: 'number',
		title: 'Low Stock Alert',
		edit: true,
		sort: true,
	},

	// Variations
	variations: {
		type: 'array-object',
		title: 'Product Variations',
		edit: true,
	},

	// Pricing
	cost: {
		type: 'number',
		title: 'Cost Price',
		required: true,
		edit: true,
		sort: true,
	},
	price: {
		type: 'number',
		title: 'Selling Price',
		required: true,
		edit: true,
		sort: true,
	},

	// Bulk discount tiers
	discountTiers: {
		type: 'array-object',
		title: 'Discount Tiers',
		edit: true,
	},

	// SEO
	slug: {
		type: 'string',
		title: 'Slug',
		edit: true,
		unique: true,
		search: true,
	},
	tags: {
		type: 'array-string',
		title: 'Tags',
		edit: true,
	},
	meta: {
		title: 'Meta',
		type: 'object',
		edit: true,
	},
	metaImage: {
		type: 'uri',
		title: 'Meta Image',
		edit: true,
	},
	metaKeywords: {
		type: 'array-string',
		title: 'Meta Keywords',
		edit: true,
	},

	// Flags
	isFeatured: {
		type: 'boolean',
		title: 'Featured',
		edit: true,
		sort: true,
	},
	isVisible: {
		type: 'boolean',
		title: 'Visible',
		edit: true,
		sort: true,
	},
	status: {
		type: 'string',
		title: 'Status',
		edit: true,
		sort: true,
		filter: {
			name: 'status',
			field: 'status',
			type: 'multi-select',
			label: 'Status',
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Published', value: 'published' },
				{ label: 'Archived', value: 'archived' },
			],
		},
	},

	// Custom & FAQ
	customAttributes: {
		type: 'array-object',
		title: 'Custom Attributes',
		edit: true,
	},
	faq: {
		type: 'array-object',
		title: 'Frequently Asked Questions',
		edit: true,
	},

	vat: {
		type: 'number',
		title: 'VAT',
		edit: true,
	},

	isDeleted: {
		type: 'boolean',
		title: 'Deleted',
	},

	createdAt: {
		type: 'string',
		title: 'Created At',
		sort: true,
		filter: {
			name: 'createdAt',
			field: 'createdAt',
			type: 'date',
			label: 'Created At',
		},
	},
};
export default settings;
