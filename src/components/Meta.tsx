import Head from 'next/head';

// Component which contains all base meta tags like open-graph etc.
export function Meta() {
  return (
    <Head>
      <title>budgetify</title>
      <meta name="description" content="Your money management software" />

      <meta property="og:url" content="https://budgetify.xyz" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="budgetify" key="ogTitle" />
      <meta property="og:description" content="Your money management software" />
      <meta property="og:image" content="https://budgetify.xyz/images/budgetify-logo.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="budgetify.xyz" />
      <meta property="twitter:url" content="https://budgetify.xyz" />
      <meta name="twitter:title" content="budgetify" />
      <meta name="twitter:description" content="Your money management software" />
      <meta name="twitter:image" content="https://budgetify.xyz/images/budgetify-logo.png" />
    </Head>
  );
}
