import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Controller from './utils/interfaces/Controller.interface'
import compression from 'compression'

import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import ErrorHandlerMiddleware from './middlewares/ErrorHandler.middleware'
import NoRouteMiddleware from './middlewares/NoRoute.middleware'

class App {
    public express: Application
    public port: number

    constructor(controllers: Controller[], port: number) {
        this.express = express()
        this.port = port

        this.connectDatabase()
        this.initializeMiddlewares()
        this.initializeControllers(controllers)
        this.initializeErrorHandler()
    }

    private async connectDatabase() {
        const response = await mongoose.connect(String(process.env.MONGO_URI))
        console.log(response.connection.host)
    }

    private initializeMiddlewares() {
        this.express.use(morgan('dev'))
        this.express.use(cors())
        this.express.use(express.json())
        this.express.use(compression())
    }

    private initializeControllers(controllers: Controller[]) {
        this.express.get('/', async (req: Request, res: Response) =>
            res.status(StatusCodes.OK).send('Tech Online Store API')
        )

        for (let controller of controllers) {
            this.express.use(`/api${controller.path}`, controller.router)
        }
    }

    private initializeErrorHandler() {
        this.express.use(NoRouteMiddleware)
        this.express.use(ErrorHandlerMiddleware)
    }

    public listen() {
        this.express.listen(this.port, () =>
            console.log(`App listening on port ${this.port}`)
        )
    }
}

export default App
