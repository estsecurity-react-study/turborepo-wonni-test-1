import Link from 'next/link';

export default function D3() {
  return (
    <div className="App">
      <ul>
        <li>
          <Link href="/D3/">index</Link>
        </li>
        <li>
          <Link href="/D3/ex1">ex 1</Link>
        </li>
        <li>
          <Link href="/D3/ex2">ex 2</Link>
        </li>
      </ul>
    </div>
  );
}
