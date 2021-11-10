import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';
import { mocked } from 'ts-jest/utils';

jest.mock('../../services/stripe');
jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    }
  }
});

describe('Home page', () => {
  it('renders correctly', () => {
    render(
      <Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }} />
    );

    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retrieveStripeMocked = mocked(stripe.prices.retrieve);

    retrieveStripeMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    );
  });
});