import { StarIcon } from '@heroicons/react/outline';
import { Modal } from '~/components/UI/Modal';
import { User } from '~/graphql/__generated__/types';

interface Props {
  members: User[];
  owner: User;
}

export default function MemberTable({ members, owner, ...props }: Props) {
  const makeOwnerHandler = (id: string) => {
    // TODO: Write mutation for this
    console.log(id);
  };

  const removeHandler = (id: string) => {
    // TODO: Write mutation for this
    console.log(id);
  };

  return (
    <table className="w-full">
      <tbody className="divide-y divide-gray-200 ">
        {members.map((member: User) => {
          return (
            <tr key={member.id} className="">
              <td className="pl-4 py-4 w-1">
                {member.id === owner.id && (
                  <StarIcon className="flex-shrink-0 h-6 w-6 text-brand-500" />
                )}
              </td>
              <td className="py-4">
                <div className="max-w-xl overflow-auto">
                  <div className="ml-2 font-bold text-gray-100">{member.name}</div>
                </div>
              </td>
              <td className="py-4">
                <div className="max-w-xl overflow-auto">
                  <div className="ml-2 font-bold text-gray-100">{member.email}</div>
                </div>
              </td>
              <td className="py-4">
                <Modal
                  title="Remove user from household"
                  description={`Are you sure that you want to remove ${member.name} from this household?`}
                  onSubmit={() => removeHandler(member.id)}
                  buttonText="Remove"
                />
              </td>
              <td className="py-4">
                <Modal
                  title="Make owner of household"
                  description={`Are you sure that you want to make ${member.name} the new owner of this household?`}
                  onSubmit={() => makeOwnerHandler(member.id)}
                  buttonText="Make Owner"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
