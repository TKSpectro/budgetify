import React from 'react';
import { Meta } from './Meta';
import { Footer } from './UI/Footer';
import { Header } from './UI/Header';

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
