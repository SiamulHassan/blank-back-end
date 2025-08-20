// import Group from '../collection/group.model.js';
// import Shop from '../shop/shop.model.js';

const settings: any = {
	name: {
		edit: true,
		sort: true,
		search: true,
		title: 'Name',
		type: 'string',
		min: 3,
		max: 50,
		required: true,
		trim: true,
	},

	// shop: {
	// 	type: 'string',
	// 	title: 'Shop',
	// 	populate: {
	// 		path: 'shop',
	// 		select: 'name',
	// 	},
	// 	sort: true,
	// 	filter: {
	// 		roles: ['admin'],
	// 		name: 'shop',
	// 		field: 'shop_in',
	// 		type: 'multi-select',
	// 		label: 'Shop',
	// 		title: 'Sort by shop',
	// 		options: [],
	// 		category: 'model',
	// 		model: Shop,
	// 		key: 'name',
	// 	},
	// },

	email: {
		unique: true,
		search: true,
		sort: true,
		title: 'Email',
		type: 'email',
		required: true,
	},
	// group: {
	// 	sort: true,
	// 	edit: true,
	// 	title: 'Collection',
	// 	type: 'array-string',

	// 	filter: {
	// 		name: 'group',
	// 		field: 'group_in',
	// 		type: 'multi-select',
	// 		label: 'Group',
	// 		title: 'Sort by customer group',
	// 		options: [],
	// 		category: 'model',
	// 		model: Group,
	// 		key: 'name',
	// 	},
	// },
	phone: {
		search: true,
		edit: true,
		title: 'Phone',
		type: 'text',
	},

	tags: {
		search: true,
		edit: true,
		title: 'Tags',
		type: 'array-string',
		sort: true,
		filter: {
			name: 'tags',
			field: 'tags_in',
			type: 'multi-select',
			label: 'Tag',
			title: 'Sort by Tag',
			category: 'distinct',
			key: 'tags',
		},
	},

	isActive: {
		edit: true,
		type: 'boolean',
		title: 'Active Status',
		sort: true,

		filter: {
			name: 'isActive',
			type: 'boolean',
			label: 'Active',
			title: 'Sort by active status',
		},
	},
	isSubscribedToEmail: {
		edit: true,
		type: 'boolean',
		title: 'Email Subscription',
		sort: true,

		filter: {
			name: 'isSubscribedToEmail',
			type: 'boolean',
			label: 'Subscribed To Email',
			title: 'Sort by email subscription',
		},
	},

	isRegisteredOnline: {
		type: 'boolean',
		title: 'Registered Online',
		sort: true,

		filter: {
			name: 'isRegisteredOnline',
			type: 'boolean',
			label: 'Registered Online?',
			title: 'Sort by online/offline customers',
		},
	},

	password: {
		type: 'text',
		title: 'Password',
		min: 8,
	},
};

export default settings;
