import { gql } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { Category } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';

export default function Home({ categories }: { categories: Category[] }) {
  return (
    <div>
      <p className="text-xl mb-4">Server-side-props</p>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <p>
            {category.id} - {new Date(category.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  preloadQuery(ctx, {
    query: gql`
      query Categories {
        categories {
          id
          name
          createdAt
          updatedAt
        }
      }
    `,
  });
