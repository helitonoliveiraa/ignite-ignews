import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';

import styles from '../../styles/pages/home.module.scss';
import { GetStaticProps } from 'next';
import { stripe } from '../services/stripe';
import { formatPrice } from '../util/format';

type HomeProps = {
  product: {
    priceId: string;
    amount: string;
  }
};

export default function Home({ product }: HomeProps) {

  return (
    <>
      <Head>
       <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <strong>👏 Hey, welcome</strong>

          <h1>
            New about <br />
            the <span>React</span> world
          </h1>

          <p>
            Get access to all the publications<br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt=""/>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IYDqpEubnFAkL1DXlMON4aT', {
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: formatPrice(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hous
  }
};
