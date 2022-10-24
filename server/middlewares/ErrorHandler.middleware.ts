import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Error from '../utils/interfaces/Error.interface'

const ErrorHandlerMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let errorResponse = {
        message: error || 'Internal server error.',
        statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    }

    res.status(errorResponse.statusCode).send(errorResponse.message)
}

export default ErrorHandlerMiddleware
