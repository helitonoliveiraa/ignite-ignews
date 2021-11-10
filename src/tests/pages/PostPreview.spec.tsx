import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { useRouter } from "next/router";
import { mocked } from 'ts-jest/utils';

import { getPrismicClient } from '../../services/prismic';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';

const post = {
  slug: 'my-new-post',
  title: 'My New post',
  content: '<p>Post excerpt</p>',
  updatedAt: 'March, 10',  
};

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />);

    expect(screen.getByText('My New post')).toBeInTheDocument();
    expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects use to full post when user is subscribed', () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([{
        activeSubscription: 'fake-active-subscription',
      }, 
      false
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock, 
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ],
        },
        last_publication_date: '04-01-2021'
      }),
    } as any);

    const response = await getStaticProps({
      params: {
        slug: 'my-new-post',
      }
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    );
  });
});