import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Async } from './index';

test('it renders correctly', async () => {
  render(<Async />);

  waitForElementToBeRemoved(
    screen.queryByText('Button')
    , {
      timeout: 3000,
    }
  );
});