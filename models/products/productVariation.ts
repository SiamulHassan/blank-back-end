// Define the Variation sub-schema
import mongoose, { Schema } from 'mongoose';

const variationSchema = new Schema({
	name: { type: String, required: true },
	description: {
		type: String,
		trim: true,
	},
	sku: { type: String, trim: true },
	price: { type: Number, required: true },
	cost: { type: Number, default: 0 },
	stock: { type: Number, default: 0, required: true },

	attributes: [
		{
			label: { type: String },
			value: { type: String },
		},
	],
	images: [String],

});

export default variationSchema;
