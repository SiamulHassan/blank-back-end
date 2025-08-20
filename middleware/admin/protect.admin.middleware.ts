import { Admin } from '../../imports.js';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

const adminProtect = async (
	req: any,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer')) {
		return res.status(401).json({ message: 'Not authorized, no token' });
	}
	try {
		const token: string = authHeader.split(' ')[1];
		const decoded = jwt.verify(
			token,
			process.env.JWT_PRIVATE_KEY || 'fallback_key_12345_924542'
		) as any;

		req.user = await Admin.findById(decoded?._id)
			.select('-password')
			.populate('role');

		if (!req.user) {
			return res.status(401).json({ message: 'User was not found' });
		}

		req.permissions = req.user?.role?.permissions || [];

		next();
	} catch (e: any) {
		console.error(e);
		return res.status(401).json({ message: 'Not authorized, token failed' });
	}
};

export default adminProtect;

// import { Admin } from '../../imports.js';
// import { NextFunction, Response } from 'express';
// import jwt from 'jsonwebtoken';

// const adminProtect = async (
// 	req: any,
// 	res: Response,
// 	next: NextFunction
// ): Promise<Response | void> => {
// 	const authHeader = req.headers.authorization;
// 	if (!authHeader || !authHeader.startsWith('Bearer')) {
// 		return res.status(401).json({ message: 'Not authorized, no token' });
// 	}
// 	try {
// 		const token: string = authHeader.split(' ')[1];
// 		const decoded = jwt.verify(
// 			token,
// 			process.env.JWT_PRIVATE_KEY || 'fallback_key_12345_924542'
// 		) as any;

// 		req.user = await Admin.findById(decoded?._id).select('-password');

// 		if (!req.user) {
// 			return res.status(401).json({ message: 'User was not found' });
// 		}

// 		next();
// 	} catch (e: any) {
// 		console.error(e);
// 		return res.status(401).json({ message: 'Not authorized, token failed' });
// 	}
// };

// export default adminProtect;
