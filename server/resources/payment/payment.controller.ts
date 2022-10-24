import { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Stripe } from 'stripe'
import Controller from '../../utils/interfaces/Controller.interface'
import { ProductInterface } from './product.interface'

class PaymentController implements Controller {
    public path = '/payment'
    public router = Router()
    public domain = 'http://localhost:7789'

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(`/create-checkout-session`, this.create)
    }

    private create = async function (req: Request, res: Response) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2022-08-01',
        })

        const lineItems = req.body.cartItems as ProductInterface[]

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems.map((product) => {
                const { title, price, quantity } = product
                const totalPrice = price * 100

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: title,
                        },
                        unit_amount: Math.ceil(totalPrice),
                    },
                    quantity: quantity,
                }
            }),
            mode: 'payment',
            success_url: `https://loquacious-cranachan-0f2f74.netlify.app`,
            cancel_url: `https://loquacious-cranachan-0f2f74.netlify.app/cart`,
        })

        res.status(StatusCodes.OK).send(session.url)
    }
}

export default PaymentController
