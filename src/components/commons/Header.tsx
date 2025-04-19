'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

/**
 * 애플리케이션 헤더 컴포넌트
 */
const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md  border-slate-200 border h-15 flex  justify-center items-center">
      <div className='max-w-[1200px] px-6 grow'>
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt='do it' width={151} height={40} />
        </Link>
      </div>
    </header>
  );
};

export default Header;