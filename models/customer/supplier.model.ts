// import mongoose, { Schema } from 'mongoose';
// import { filters, Ledger, Order, SettingsType } from '../../imports.js';

// type SupplierType = {
// 	name: string;
// 	email: string;
// 	phone: string;
// 	address: string;
// 	isActive: boolean;
// 	isDeleted: boolean;
// 	tags: string[];
// 	notes: string[];
// 	payable: number;
// 	receivable: number;
// 	createdAt?: Date;
// 	shop?: Schema.Types.ObjectId;
// 	paymentTerms?: string;
// 	creditLimit?: number;
// };

// const paymentTerms = ['net-30', 'net-60', 'prepaid', 'cod', 'others'];

// const schema = new Schema<SupplierType>(
// 	{
// 		name: {
// 			type: String,
// 			trim: true,
// 			required: [true, 'Name is required'],
// 		},

// 		shop: {
// 			type: Schema.Types.ObjectId,
// 			ref: 'Shop',
// 			required: true,
// 		},

// 		creditLimit: {
// 			type: Number,
// 			min: 0,
// 			default: 0,
// 		},

// 		email: {
// 			type: String,
// 			trim: true,
// 			toLowerCase: true,
// 		},
// 		phone: { type: String, trim: true, required: [true, 'Phone Number is required'] },
// 		address: {
// 			type: String,
// 			trim: true,
// 		},

// 		isActive: {
// 			type: Boolean,
// 			default: true,
// 			required: true,
// 		},

// 		isDeleted: {
// 			type: Boolean,
// 			default: false,
// 		},

// 		paymentTerms: {
// 			type: String,
// 			enum: paymentTerms,
// 		},

// 		tags: [String],
// 		notes: {
// 			type: [String],
// 			trim: true,
// 		},
// 		payable: {
// 			type: Number,
// 			default: 0,
// 		},
// 		receivable: {
// 			type: Number,
// 			default: 0,
// 		},
// 	},

// 	{
// 		timestamps: true,
// 	}
// );

// let isNewDoc = false;

// schema.pre<any>('save', function (next) {
// 	isNewDoc = this.isNew;
// 	next();
// });

// // Pre-save hook to auto-increment the invoice number
// schema.post<any>('save', async function (next) {
// 	try {
// 		if (!isNewDoc) return;

// 		if (this.payable && this.payable > 0) {
// 			const ledger = new Ledger({
// 				amount: this.payable,
// 				account: 'credit',
// 				type: 'supplier',
// 				amountReceived: this.payable,
// 				note: `Opening payable balance for supplier ${this.name}`,
// 				date: Date.now(),
// 				supplier: this._id,
// 				shop: this.shop.toString(),
// 			});
// 			await ledger.save();
// 		}
// 		if (this.receivable && this.receivable > 0) {
// 			const ledger = new Ledger({
// 				amount: this.receivable,
// 				account: 'debit',
// 				type: 'supplier',
// 				amountSent: this.receivable,
// 				note: `Opening receivable balance for supplier ${this.name}`,
// 				date: Date.now(),
// 				supplier: this._id,
// 				shop: this.shop.toString(),
// 			});
// 			await ledger.save();
// 		}
// 	} catch (error: any) {
// 		console.log('Error creating ledger entry:', error);
// 	}
// });

// export const supplierSettings: SettingsType<SupplierType> = {
// 	name: {
// 		title: 'Name',
// 		type: 'string',
// 		required: true,
// 		edit: true,
// 		search: true,
// 	},
// 	creditLimit: {
// 		title: 'Credit Limit',
// 		type: 'number',
// 		edit: true,
// 	},
// 	phone: {
// 		title: 'Phone',
// 		type: 'string',
// 		required: true,
// 		edit: true,
// 		search: true,
// 		unique: true,
// 		sort: true,
// 		filter: {
// 			name: 'phone',
// 			field: 'phone',
// 			type: 'text',
// 			label: 'Phone',
// 			title: 'Filter by phone',
// 		},
// 	},
// 	paymentTerms: {
// 		title: 'Payment Terms',
// 		type: 'string',
// 		edit: true,
// 	},
// 	email: {
// 		title: 'Email',
// 		type: 'string',
// 		required: true,
// 		edit: true,
// 		search: true,
// 		sort: true,
// 		filter: {
// 			name: 'email',
// 			field: 'email',
// 			type: 'text',
// 			label: 'Email',
// 			title: 'Filter by email',
// 		},
// 	},
// 	address: {
// 		title: 'Address',
// 		type: 'string',
// 		edit: true,
// 	},
// 	isActive: {
// 		title: 'Active',
// 		type: 'boolean',
// 		edit: true,
// 	},
// 	isDeleted: {
// 		title: 'Deleted',
// 		type: 'boolean',
// 		edit: true,
// 	},
// 	tags: {
// 		title: 'Tags',
// 		type: 'array',
// 		edit: true,
// 	},
// 	notes: {
// 		title: 'Notes',
// 		type: 'array',
// 		edit: true,
// 	},
// 	payable: {
// 		title: 'Payable',
// 		type: 'number',
// 		edit: true,
// 	},
// 	receivable: {
// 		title: 'Receivable',
// 		type: 'number',
// 		edit: true,
// 	},
// 	createdAt: {
// 		title: 'Created At',
// 		type: 'string',
// 		// filter: filters.createdAt,
// 		sort: true,
// 	},
// };

// const Supplier = mongoose.model<any>('Supplier', schema);
// export default Supplier;
