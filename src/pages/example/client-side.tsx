import { ClientOnly } from '~/components/ClientOnly';
//import Countries from '~/components/Countries';

export default function ClientSide() {
  return (
    <div className="container">
      <p className="text-xl mb-4">Client-side</p>
      <ClientOnly>{/* <Countries /> */}</ClientOnly>
    </div>
  );
}
