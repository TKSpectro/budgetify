# budgetify

[![Tests](https://github.com/TKSpectro/budgetify/actions/workflows/test.yml/badge.svg)](https://github.com/TKSpectro/budgetify/actions/workflows/test.yml)

budgetify is a project that can be used to manage you're income/outcome in your households.

The Stack is Typescript, NextJS(ReactJS), GraphQL, Nexus and Prisma.

## Setup

Install all required dependencies:

```bash
npm install
```

Copy the example environment file and fill change it to your needs.

```bash
cp .env.example .env
```

Before starting for the first time you need to start the docker and migrate with prisma.

```bash
docker-compose up
npm run prisma:migrate
```

Finally you can either start developing.

```bash
npm run dev
```

Or build the project and then start it.

```bash
npm run build
npm run start
```

## Used technologies

- **[Next.js](https://nextjs.org/)**
- **[GraphQL](https://graphql.org/)**
- **[Apollo](https://www.apollographql.com/):** Apollo Client and Apollo-Server-Micro
- **[Prisma](https://www.prisma.io/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind](https://tailwindcss.com)**

## Deployment

The latest push of the project is always deployed on Heroku.
You can try the page there, but dont use it as your actual management as the database is cleared regularly.

The site runs under <https://budgetify-bachelor.herokuapp.com//>

## N+1 Problem with GraphQL

Prisma has integrated functionality to fix this problem:
<https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance#solving-the-n1-problem>
