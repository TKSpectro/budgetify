import { gql } from '@apollo/client';
import client from '@/utils/apollo';

export default function Home({ countries }) {
  return (
    <div>
      <p className="text-xl mb-4">Static-Props</p>
      {countries.map((country) => (
        <div key={country.code}>
          <h3>{country.name}</h3>
          <p>
            {country.code} - {country.emoji}
          </p>
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query Countries {
        countries {
          code
          name
          emoji
        }
      }
    `,
  });

  return {
    props: {
      countries: data.countries.slice(0, 4),
    },
  };
}
