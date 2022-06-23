import { AppShell, Header } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import HeaderContent from './HeaderContent';

export default function Layout() {
  return (
    <AppShell
      header={
        <Header height={60} p="xs">
          <HeaderContent />
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}
