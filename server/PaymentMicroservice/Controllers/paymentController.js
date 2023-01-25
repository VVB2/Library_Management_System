import * as dotenv from 'dotenv';
dotenv.config();
import Stripe from "stripe";

export const payFine = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const fine = req.body 
    const paymentIntent = await stripe.paymentIntents.create({
        description: 'Software development services',
        shipping: {
          name: 'Jenny Rosen',
          address: {
            line1: '510 Townsend St',
            postal_code: '98140',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
          },
        },
        amount: 1099,
        currency: 'usd',
        payment_method_types: ['card'],
      });
    res.status(201).json({ paymentIntent });
}