import { NextApiResponse, NextApiRequest } from 'next';
import { getSession } from 'next-auth/client';
import { query as q } from 'faunadb';

import { stripe } from '../../services/stripe';
import { fauna } from '../../services/fauna';

type User = {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  // Verification for just listen POST method
  if (request.method === 'POST') {
    const session = await getSession({ req: request });

    // Get logged user from FaunaDB
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email),
        ),
      ),
    );

    let customerId = user.data.stripe_customer_id;

    // Verify if logged user already is a customer on stipe database
    if (!customerId) {
      console.log('chegou aqui');
      // Register the new payment customer on stripe database
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });
  
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        ),
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1IYDqpEubnFAkL1DXlMON4aT', quantity: 1 },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });


    return response.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}