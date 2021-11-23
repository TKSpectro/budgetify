import { ApolloError, gql, useMutation } from '@apollo/client';
import { PlusIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { Household } from '~/graphql/__generated__/types';
import { uuidRegex } from '~/utils/helper';
import { HouseholdList } from '../Household/HouseholdList';
import { Container } from '../UI/Container';
import { Error } from '../UI/Error';
import { Input } from '../UI/Input';
import { Loader } from '../UI/Loader';
import { ModalForm } from '../UI/ModalForm';
import {
  CreateHouseholdMutation,
  CreateHouseholdMutationVariables,
  UseInviteTokenMutation,
  UseInviteTokenMutationVariables,
} from './__generated__/HouseholdContainer.generated';

const USE_INVITE_TOKEN_MUTATION = gql`
  mutation useInviteTokenMutation($token: String!) {
    useInvite(token: $token) {
      id
    }
  }
`;

const CREATE_HOUSEHOLD_MUTATION = gql`
  mutation createHouseholdMutation($name: String!) {
    createHousehold(name: $name) {
      id
    }
  }
`;

interface Props {
  households: Household[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  t: TFunction;
}

export function HouseholdContainer({ households, loading, error, refetch, t }: Props) {
  const form = useForm<UseInviteTokenMutationVariables>({ defaultValues: { token: '' } });

  const createHouseholdForm = useForm<CreateHouseholdMutationVariables>({
    defaultValues: { name: '' },
  });

  const [UseInviteMutation, { error: useInviteError }] = useMutation<
    UseInviteTokenMutation,
    UseInviteTokenMutationVariables
  >(USE_INVITE_TOKEN_MUTATION, {
    onCompleted: () => {
      refetch();
      form.reset();
    },
    onError: () => {
      form.reset();
    },
  });

  const [createHouseholdMutation, { error: createHouseholdError }] = useMutation<
    CreateHouseholdMutation,
    CreateHouseholdMutationVariables
  >(CREATE_HOUSEHOLD_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const onSubmitHandler = () => {
    UseInviteMutation({ variables: { token: form.getValues('token') } });
  };

  const createHouseholdSubmitHandler = () => {
    createHouseholdMutation({ variables: { ...createHouseholdForm.getValues() } });
  };

  return (
    <Container
      title={t('households')}
      action={
        <ModalForm
          form={createHouseholdForm}
          buttonText={<PlusIcon className="w-6 h-6" />}
          buttonSquare
          title={t('households:createHousehold')}
          onSubmit={createHouseholdSubmitHandler}
          submitText={t('households:createHousehold')}
        >
          <Input
            label="Name"
            {...createHouseholdForm.register('name', {
              required: { value: true, message: t('households:householdRequiredMessage') },
              minLength: { value: 2, message: t('households:householdLengthMessage') },
            })}
          ></Input>
        </ModalForm>
      }
    >
      <div className="min-h-[20rem] relative">
        <div className="pb-16">
          <Error
            title={t('home:householdsNotFoundError')}
            error={households.length === 0 ? '' : undefined}
          />
          <Error title={t('useInviteError')} error={useInviteError} />
          <Error title={t('createHouseholdError')} error={createHouseholdError} />
          <Error title={t('loadingError')} error={error} />
          <Loader loading={loading} />

          <HouseholdList households={households} t={t} />
        </div>
        {/* // TODO: Maybe move to profile */}
        <div className="absolute bottom-0 w-full">
          <ModalForm
            form={form}
            buttonText={t('households:useInvite')}
            buttonClassName=" w-full"
            title={t('households:useInvite')}
            onSubmit={onSubmitHandler}
            submitText={t('households:useInvite')}
          >
            <Input
              label={t('common:token')}
              {...form.register('token', {
                required: { value: true, message: t('common:tokenRequiredMessage') },
                minLength: { value: 30, message: t('common:tokenLengthMessage') },
                pattern: { value: uuidRegex, message: t('common:tokenPatternMessage') },
              })}
            ></Input>
          </ModalForm>
        </div>
      </div>
    </Container>
  );
}
