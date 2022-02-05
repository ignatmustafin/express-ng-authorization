import express from 'express';
import ApiError from '../exceptions/api.errors';

export default function (err: any, req: express.Request, res: express.Response, next: any) {
    console.error(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({ success: false, message: err.message, errors: err.errors });
    }
    return res.status(500).json({ success: false, message: `Server error: ${err.errors}` });
}