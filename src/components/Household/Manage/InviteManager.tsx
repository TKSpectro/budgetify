import { useRouter } from 'next/router';
import { Link } from '~/components/UI/Link';
import { Invite } from '~/graphql/__generated__/types';

interface Props {
  invites: Invite[];
}

export default function InviteManager({ invites, ...props }: Props) {
  const router = useRouter();
  return (
    <>
      <Link href={router.asPath + '/invite'} asButton>
        New Invite
      </Link>
      <div className="mt-4">
        {invites.map((invite) => {
          return (
            <div key={invite.id}>
              <div>{invite.invitedEmail}</div>
              <div>{invite.validUntil}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
