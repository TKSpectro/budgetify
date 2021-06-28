import { gql } from '@apollo/client';
import { initializeApollo } from '@/utils/apollo';
import { Category } from '@/graphql/__generated__/types';

export default function Home({ categories }: { categories: Category[] }) {
  return (
    <div>
      <p className="text-xl mb-4">Static-Props</p>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <p>
            {/* TODO Find out why createdAt and updatedAt are apparently null/undefined */}
            {category.id} - {category.createdAt} - {category.updatedAt}
          </p>
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const client = initializeApollo();
  const { data } = await client.query({
    query: gql`
      query Categories {
        categories {
          id
          name
        }
      }
    `,
  });
  const cat: Category[] = data.categories;
  return {
    props: {
      categories: data.categories.slice(0, 4),
    },
  };
}
