import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/commons/Header';

export const metadata: Metadata = {
  title: 'Todo List App',
  description: '할 일 목록을 관리하는 To Do 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className=" bg-[#f9fafb] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}