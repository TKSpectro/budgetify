import React from 'react';
import { Footer } from './UI/Footer';
import { Header } from './UI/Header';

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
