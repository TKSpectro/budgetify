import Link from 'next/link';

export default function Custom404() {
  return (
    <div>
      <div className="mb-2">Page could not be found.</div>
      <Link href="/">Go back to dashboard.</Link>
    </div>
  );
}
