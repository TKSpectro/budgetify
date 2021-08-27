import { Invite } from '~/graphql/__generated__/types';

interface Props {
  invites: Invite[];
}

export default function InviteManager({ invites, ...props }: Props) {
  return (
    <div>
      {invites.map((invite) => {
        return (
          <div key={invite.id}>
            <div>{invite.invitedEmail}</div>
            <div>{invite.validUntil}</div>
          </div>
        );
      })}
    </div>
  );
}
