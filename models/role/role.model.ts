import { required } from 'joi';
import mongoose, { Schema, Types } from 'mongoose';

const schema = new Schema<any>(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			uppercase: true,
		},
		description: {
			type: String,
			trim: true,
		},
		logo: {
			type: String,
			trim: true,
		},

		permissions: {
			type: [String],
			default: [],
		},

		isActive: {
			type: Boolean,
			default: true,
			required: true,
		},

		image: {
			type: String,
			trim: true,
		},
		// shop: {
		// 	type: Schema.Types.ObjectId,
		// 	ref: 'Shop',
		// 	required: [true, 'Shop is required'],
		// },
	},

	{
		timestamps: true,
	}
);

const Role = mongoose.model<any>('Role', schema);
export default Role;
export { default as settings } from './role.settings.js';
