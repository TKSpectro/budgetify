import { gql, useQuery } from '@apollo/client';
import {
  AnnotationIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
} from '@heroicons/react/outline';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { preloadQuery } from '~/utils/apollo';
import { HomeQuery, HomeQueryVariables } from './__generated__/index.page.generated';

export const HOME_QUERY = gql`
  query homeQuery {
    me {
      id
      firstname
      lastname
      name
      email
      receiveNotifications
      isAdmin
      households {
        id
        name
        sumOfAllPayments
        owner {
          name
        }
      }
      groups {
        id
        name
        value
        transactionCount
      }
    }
  }
`;

export default function Home() {
  const { t } = useTranslation(['common', 'home']);

  const { data, loading, error } = useQuery<HomeQuery, HomeQueryVariables>(HOME_QUERY);

  const loggedIn = !!data?.me;

  const households = data?.me?.households || [];
  const groups = data?.me?.groups || [];

  const householdFeatures = [
    {
      name: 'Quick Overview',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: GlobeAltIcon,
    },
    {
      name: 'Easy to use',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: ScaleIcon,
    },
    {
      name: 'Graphs',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: LightningBoltIcon,
    },
    {
      name: 'Easy Management',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: AnnotationIcon,
    },
  ];

  const groupFeatures = [
    {
      name: 'Quick setup',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: LightningBoltIcon,
    },
    {
      name: 'Invite system',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: GlobeAltIcon,
    },
    {
      name: 'Transfers are instant',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: ScaleIcon,
    },
    {
      name: 'Mobile notifications',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: AnnotationIcon,
    },
  ];

  return (
    <div>
      <Head>
        <title>budgetify</title>
      </Head>

      {loggedIn ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 lg:gap-x-8 overflow-auto md:mx-16 md:px-4">
          <Container title={t('households')}>
            <Error
              title={t('home:householdsNotFoundError')}
              error={households.length === 0 ? '' : undefined}
            />
            <Error title={t('loadingError')} error={error} />
            <Loader loading={loading} />

            {households.map((household) => {
              return (
                <Link href={`/households/${household?.id}`} passHref key={household?.id}>
                  <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
                    <div className="text-xl">
                      {household?.name}
                      <span className="float-right hidden sm:block">
                        Balance: {household?.sumOfAllPayments}€
                      </span>
                    </div>
                    <div>
                      {t('home:owner')}: {household?.owner?.name}
                    </div>
                    <span className="sm:hidden">Balance: {household?.sumOfAllPayments}€</span>
                  </div>
                </Link>
              );
            })}
          </Container>
          <Container title={t('groups')}>
            <Error
              title={t('home:groupsNotFoundError')}
              error={groups.length === 0 ? '' : undefined}
            />
            <Loader loading={loading} />

            {groups.map((group) => {
              return (
                <Link href={`/groups/${group?.id}`} passHref key={group?.id}>
                  <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
                    <div className="text-xl">
                      {group?.name}
                      <span className="float-right hidden sm:block">Balance: {group?.value}€</span>
                    </div>
                    <div>
                      {t('home:transactions')}: {group?.transactionCount}
                    </div>
                    <span className="sm:hidden">Balance: {group?.value}€</span>
                  </div>
                </Link>
              );
            })}
          </Container>
        </div>
      ) : (
        // TODO: Write Feature Stuff
        <>
          <div className="w-full text-center mt-16">
            <div className="font-bold text-6xl lg:text-8xl text-brand-500">budgetify</div>
            <div className="font-semibold text-2xl mt-8">Improve your financial management</div>
          </div>
          <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-brand-500 font-semibold tracking-wide uppercase">
                  Households
                </h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Managing money made easy
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                  Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum
                  cupiditate veritatis in accusamus quisquam.
                </p>
              </div>

              <div className="mt-10">
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  {householdFeatures.map((feature) => (
                    <div key={feature.name} className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                          <feature.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          {feature.name}
                        </p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-brand-500 font-semibold tracking-wide uppercase">
                  Groups
                </h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Moneypools for all your vacations and group activities
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                  Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum
                  cupiditate veritatis in accusamus quisquam.
                </p>
              </div>

              <div className="mt-10">
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  {groupFeatures.map((feature) => (
                    <div key={feature.name} className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                          <feature.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          {feature.name}
                        </p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'home'])),
      ...(await preloadQuery(ctx, { query: HOME_QUERY })),
    },
  };
};
