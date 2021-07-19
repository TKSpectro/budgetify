# budgetify

This project can be used to manage you're income/outcome.

The Stack is Typescript, NextJS(ReactJS), GraphQL, Nexus and Prisma.

## Deployment

As NextJS is used the easiest way to deploy is using Vercel.
The site runs under <https://budgetify.vercel.app/>

The database is currently hosted on heroku but this might change.

## N+1 Problem with GraphQL

Prisma has integrated functionality to fix this problem:
<https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance#solving-the-n1-problem>

## Setup

```Markdown
Setup PostgreSQL Database and change database string in .env

Run "npm install" to download needed packages

Run "npm run dev" for development or "npm run build" for a full build

```
