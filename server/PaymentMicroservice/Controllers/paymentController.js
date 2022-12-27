import Stripe from "stripe";
import logger from "../logger/logger.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1400000,
            currency: "inr",
            automatic_payment_methods: {
              enabled: true,
            },
        });
        
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
}