import { gql } from '@apollo/client';
import { Category } from '~/graphql/__generated__/types';
import { initializeApollo } from '~/utils/apollo';

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

export async function getServerSideProps() {
  const client = initializeApollo();
  const { data } = await client.query({
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

  return {
    props: {
      categories: data.categories.slice(0, 4),
    },
  };
}
