export { default as authRoute } from './auth.route.js';
// export { default as customerRoute } from './customers.route.js';
export { default as roleRoute } from './role.route.js';
export { default as uploadRoute } from './upload.route.js';
export { default as userRoute } from './user.route.js';
export { default as smsRoute } from './sms.route.js';
export { default as viewsRoute } from './views.route.js';

// ------------- gym management --------------
import getSidebar from '../controllers/common/getSidebar.controller.js';
import {
	getModelKeys,
	// Doc,
	// docSettings,
	User,
	userSettings,
	Role,
	roleSettings,
	adminProtect as protect,
	SidebarCategory,
	sidebarCategorySettings,
	SidebarItem,
	sidebarItemSettings,
	sidebarItemConfig,
	sidebarCategoryConfig,
	adminProtect,
	Admin,
	AdminConfig,
	adminSettings,
	AdminRole,
	adminRoleConfig,
	adminRoleSettings,
	getAdminPermissionList,
	getAdminSidebar,
	Permission,
	permissionConfig,
	permissionsSettings,
	Member,
	memberSettings,
	membersConfig,
	Employee,
	employeeSettings,
	employeeConfig,
	Product,
	productSettings,
	productConfig,
} from '../imports.js';
import productRoute from './products.route.js';
import authRouter from '../routes-admin/auth/auth.admin.route.js';
import commonRouter from './common/router.js';
import uploadRoute from './upload.route.js';

import express from 'express';

const router = express.Router();

router.use('/upload', uploadRoute);
router.get('/model/:id/:type', getModelKeys);
// router.get('/model/:id/:type', getModelKeys);

router.get('/sidebar/:platform/:type', adminProtect, getAdminSidebar());
// router.get('/sidebar/:platform/:type', adminProtect, getAdminSidebar());
router.use('/auth', authRouter);
router.get('/permissionlist', getAdminPermissionList());
// router.use('/brands', brandRoute);
// router.use('/categories', categoryRoute);
// router.use('/products', productRoute);
router.use(
	'/users',
	commonRouter({
		Model: User,
		settings: userSettings,
		permission: 'user',
	})
);
// old route
router.use('/products', productRoute);
// router.use(
// 	'/products',
// 	commonRouter({
// 		Model: Product,
// 		settings: productSettings,
// 		frontendConfig: productConfig,
// 		permission: 'user',
// 	})
// );
// router.use(
// 	'/products/create',
// 	commonRouter({
// 		Model: Product,
// 		settings: productSettings,
// 		frontendConfig: productConfig,
// 		permission: 'user',
// 	})
// );

router.use(
	'/employees',
	commonRouter({
		Model: Employee,
		settings: employeeSettings,
		permission: 'employees',
		frontendConfig: employeeConfig,
	})
);
router.use(
	'/members',
	commonRouter({
		Model: Member,
		settings: memberSettings,
		permission: 'members',
		frontendConfig: membersConfig,
	})
);
router.use(
	'/admins',
	commonRouter({
		Model: Admin,
		settings: adminSettings,
		permission: 'admins',
		frontendConfig: AdminConfig,
	})
);
router.use(
	'/roles',
	commonRouter({
		Model: AdminRole,
		settings: adminRoleSettings,
		permission: 'roles',
		frontendConfig: adminRoleConfig,
	})
);

router.use(
	'/sidebarcategories',
	commonRouter({
		Model: SidebarCategory,
		settings: sidebarCategorySettings,
		permission: 'sidebar',
		frontendConfig: sidebarCategoryConfig,
	})
);

router.use(
	'/sidebaritems',
	commonRouter({
		Model: SidebarItem,
		settings: sidebarItemSettings,
		permission: 'sidebar',
		frontendConfig: sidebarItemConfig,
	})
);

// permissions
router.use(
	'/permissions',
	commonRouter({
		Model: Permission,
		settings: permissionsSettings,
		permission: 'user',
		frontendConfig: permissionConfig,
	})
);

// router.use(
// 	'/documents',
// 	commonRouter({
// 		Model: Doc,
// 		settings: docSettings,
// 		permission: 'blog',
// 	})
// );

// router.use(
// 	'/roles',
// 	commonRouter({
// 		Model: Role,
// 		settings: roleSettings,
// 		permission: 'role',
// 	})
// );

// router.use(
// 	'/teams',
// 	commonRouter({
// 		Model: Team,
// 		settings: teamSettings,
// 		permission: 'blog',
// 	})
// );

// router.use(
// 	'/properties',
// 	commonRouter({
// 		Model: Property,
// 		settings: propertySettings,
// 		permission: 'blog',
// 	})
// );

export default router;
