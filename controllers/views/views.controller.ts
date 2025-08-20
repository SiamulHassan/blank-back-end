import { Request, Response } from 'express';
// import { View } from '../../models/index.js';
import View, { ViewType } from '../../models/views/model.js';

export { default as trackView } from './trackView.controller.js';

// Update view engagement metrics
export const updateViewEngagement = async (req: Request, res: Response) => {
	try {
		const { viewId } = req.params;
		const { timeOnPage, sessionDuration, interactions, bounceRate, exitPage, pagesPerSession } =
			req.body;

		const updateData: Partial<ViewType> = {};

		if (timeOnPage !== undefined) updateData.timeOnPage = timeOnPage;
		if (sessionDuration !== undefined) updateData.sessionDuration = sessionDuration;
		if (interactions !== undefined) updateData.interactions = interactions;
		if (bounceRate !== undefined) updateData.bounceRate = bounceRate;
		if (exitPage !== undefined) updateData.exitPage = exitPage;
		if (pagesPerSession !== undefined) updateData.pagesPerSession = pagesPerSession;

		const view = await View.findByIdAndUpdate(viewId, updateData, { new: true });

		if (!view) {
			return res.status(404).json({
				success: false,
				message: 'View not found',
			});
		}

		res.json({
			success: true,
			message: 'View engagement updated successfully',
			data: view,
		});
	} catch (error) {
		console.error('Error updating view engagement:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to update view engagement',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

// Get analytics summary
export const getAnalyticsSummary = async (req: Request, res: Response) => {
	try {
		const { startDate, endDate, pageSlug, country } = req.query;

		const options: any = {};

		if (startDate) options.startDate = new Date(startDate as string);
		if (endDate) options.endDate = new Date(endDate as string);
		if (pageSlug) options.pageSlug = pageSlug as string;
		if (country) options.country = country as string;

		const summary = await (View as any).getAnalyticsSummary(options);

		res.json({
			success: true,
			data: summary[0] || {
				totalViews: 0,
				uniqueVisitors: 0,
				returningVisitors: 0,
				avgTimeOnPage: 0,
				avgScrollDepth: 0,
				totalClicks: 0,
				botTraffic: 0,
			},
		});
	} catch (error) {
		console.error('Error getting analytics summary:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to get analytics summary',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

// Get top pages
export const getTopPages = async (req: Request, res: Response) => {
	try {
		const { limit = '10', startDate, endDate } = req.query;

		const limitNum = parseInt(limit as string, 10);
		const startDateObj = startDate ? new Date(startDate as string) : undefined;
		const endDateObj = endDate ? new Date(endDate as string) : undefined;

		const topPages = await (View as any).getTopPages(limitNum, startDateObj, endDateObj);

		res.json({
			success: true,
			data: topPages,
		});
	} catch (error) {
		console.error('Error getting top pages:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to get top pages',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

// Get traffic sources
export const getTrafficSources = async (req: Request, res: Response) => {
	try {
		const { limit = '10', startDate, endDate } = req.query;

		const limitNum = parseInt(limit as string, 10);
		const startDateObj = startDate ? new Date(startDate as string) : undefined;
		const endDateObj = endDate ? new Date(endDate as string) : undefined;

		const trafficSources = await (View as any).getTrafficSources(
			limitNum,
			startDateObj,
			endDateObj
		);

		res.json({
			success: true,
			data: trafficSources,
		});
	} catch (error) {
		console.error('Error getting traffic sources:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to get traffic sources',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

// Get geographic data
export const getGeographicData = async (req: Request, res: Response) => {
	try {
		const { startDate, endDate } = req.query;

		const startDateObj = startDate ? new Date(startDate as string) : undefined;
		const endDateObj = endDate ? new Date(endDate as string) : undefined;

		const geographicData = await (View as any).getGeographicData(startDateObj, endDateObj);

		res.json({
			success: true,
			data: geographicData,
		});
	} catch (error) {
		console.error('Error getting geographic data:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to get geographic data',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

// Get real-time analytics
export const getRealTimeAnalytics = async (req: Request, res: Response) => {
	try {
		const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

		const recentViews = await View.find({
			visitDate: { $gte: fifteenMinutesAgo },
			isBot: { $ne: true },
		})
			.sort({ visitDate: -1 })
			.limit(100)
			.select('pageSlug pageTitle location.country device.type visitDate isUniqueVisitor');

		const activeVisitors = await View.countDocuments({
			visitDate: { $gte: fifteenMinutesAgo },
			isBot: { $ne: true },
		});

		const topActivePagesLast15Min = await View.aggregate([
			{
				$match: {
					visitDate: { $gte: fifteenMinutesAgo },
					isBot: { $ne: true },
				},
			},
			{
				$group: {
					_id: '$pageSlug',
					views: { $sum: 1 },
					uniqueVisitors: { $sum: { $cond: ['$isUniqueVisitor', 1, 0] } },
				},
			},
			{ $sort: { views: -1 } },
			{ $limit: 5 },
		]);

		res.json({
			success: true,
			data: {
				activeVisitors,
				recentViews,
				topActivePages: topActivePagesLast15Min,
				lastUpdated: new Date(),
			},
		});
	} catch (error) {
		console.error('Error getting real-time analytics:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to get real-time analytics',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

// Export post controller functions
export { trackViewPost, updateViewEngagementPost, bulkTrackViews } from './post.controller.js';
