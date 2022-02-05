export default class ApiError extends Error {
    status: any;
    errors: any;

    constructor(status: number, message: string, errors?: any) {
        super(message);
        this.status = status;
        this.errors = errors;

    }

    static UnauthorizedError() {
        return new ApiError(401, 'User unauthorized');
    }

    static BadRequest(message: string, errors?: any) {
        return new ApiError(400, message, errors);
    }
}