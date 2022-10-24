import App from './app'
import dotenv from 'dotenv'
import 'express-async-errors'
import PaymentController from './resources/payment/payment.controller'
dotenv.config()

const PORT = Number(process.env.PORT) || 7789

const app = new App([new PaymentController()], PORT)

app.listen()
