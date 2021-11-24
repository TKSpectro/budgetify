import {
  AdjustmentsIcon,
  BellIcon,
  BriefcaseIcon,
  ChartPieIcon,
  ChatAlt2Icon,
  ExternalLinkIcon,
  UserAddIcon,
  ViewGridIcon,
} from '@heroicons/react/solid';
import { TFunction } from 'next-i18next';
import { Container } from '../UI/Container';

interface Props {
  t: TFunction;
}

export function Informations({ t }: Props) {
  const householdFeatures = [
    {
      name: t('home:household1Title'),
      description: t('home:household1Description'),
      icon: ViewGridIcon,
    },
    {
      name: t('home:household2Title'),
      description: t('home:household2Description'),
      icon: ChartPieIcon,
    },
    {
      name: t('home:household3Title'),
      description: t('home:household3Description'),
      icon: BriefcaseIcon,
    },
    {
      name: t('home:household4Title'),
      description: t('home:household4Description'),
      icon: ChatAlt2Icon,
    },
  ];

  const groupFeatures = [
    {
      name: t('home:group1Title'),
      description: t('home:group1Description'),
      icon: AdjustmentsIcon,
    },
    {
      name: t('home:group2Title'),
      description: t('home:group2Description'),
      icon: ExternalLinkIcon,
    },
    {
      name: t('home:group3Title'),
      description: t('home:group3Description'),
      icon: UserAddIcon,
    },
    {
      name: t('home:group4Title'),
      description: t('home:group4Description'),
      icon: BellIcon,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 lg:gap-x-8 overflow-auto sm:mx-8 lg:mx-[28rem] md:px-4 border-t-2 border-gray-400">
        <Container title={t('common:households')}>
          <>
            <p className="text-center font-semibold">{t('home:householdText')}</p>

            <dl className="mt-4">
              {householdFeatures.map((feature) => (
                <div key={feature.name} className="relative mb-4">
                  <dt>
                    <div className="absolute flex items-center justify-center mt-1 h-8 w-8 text-brand-500">
                      <feature.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <p className="ml-12 text-base leading-6 font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-1 ml-12 text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        </Container>
        <Container title={t('common:groups')}>
          <>
            <p className="text-center font-semibold">{t('home:groupText')}</p>

            <dl className="mt-4">
              {groupFeatures.map((feature) => (
                <div key={feature.name} className="relative mb-4">
                  <dt>
                    <div className="absolute flex items-center justify-center mt-1 h-8 w-8 text-brand-500 dark:text-white">
                      <feature.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <p className="ml-12 text-base leading-6 font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-1 ml-12 text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        </Container>
      </div>
    </>
  );
}
