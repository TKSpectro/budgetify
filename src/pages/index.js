import Head from 'next/head';

export default function Home(props) {
  return (
    <>
      <Head>
        <title>Budgetify</title>
        <meta name="description" content="This is a application for managing your budgets" />
        <link rel="icon" href="../public/favicon.ico" />
      </Head>

      <div className="w-screen h-screen bg-gray-700">
        <div className="text-6xl text-brand-300">NextStars: 🌟 {props.stars} </div>
      </div>
    </>
  );
}

Home.getInitialProps = async (ctx) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js');
  const json = await res.json();
  return { stars: json.stargazers_count };
};
