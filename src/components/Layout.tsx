import React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Meta } from './Meta';

interface Props {
  children: React.ReactNode;
}

/**
 * Wrapper component for the base layout of the page (Base Meta Tags, Header, Footer)
 */
export function Layout({ children }: Props) {
  return (
    <>
      <Meta />
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </>
  );
}
