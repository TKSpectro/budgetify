import { gql } from '@apollo/client';
import { useApollo } from '@/utils/apollo';

export default function Home({ categories }) {
  return (
    <div>
      <p className="text-xl mb-4">Static-Props</p>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <p>
            {category.id} - {category.createdAt}
          </p>
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const client = useApollo();
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

  return {
    props: {
      categories: data.categories.slice(0, 4),
    },
  };
}
