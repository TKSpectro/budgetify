import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/example/static">
            <a>Static-Props</a>
          </Link>
        </li>
        <li>
          <Link href="/example/server-side">
            <a>Server-Side-Props</a>
          </Link>
        </li>
        <li>
          <Link href="/example/client-side">
            <a>Client-Side-Only</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
