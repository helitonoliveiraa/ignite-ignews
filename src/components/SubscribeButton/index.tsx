import { useSession, signIn } from 'next-auth/client';
import { getStripeJs } from '../../services/stripe-js';

import { api } from '../../services/api';

import styles from './styles.module.scss';

type SubscribeButtonProps = {
  priceId: string
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    // Verify if user is signed
    if (!session) {
      signIn();
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    } 
  }

  return (
    <button 
      type="button" 
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}