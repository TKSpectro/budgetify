import React from 'react';
import { Header } from './UI/Header';

interface Props {
  children: React.ReactNode;
}
export function Layout({ children }: Props) {
  return (
    <>
      <Header />
      {children}{' '}
    </>
  );
}
