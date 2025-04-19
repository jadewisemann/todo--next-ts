'use client';

import type React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isShrink?: boolean;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 * @param children - 버튼 내부 콘텐츠
 * @param isShrink - 모바일에서 축소 여부 (기본값: true)
 * @param className - 추가 스타일 클래스
 * @param props - 기타 HTML 버튼 속성들
 * @returns 스타일링된 버튼 컴포넌트
 */
const Button: React.FC<ButtonProps> = ({
  children,
  isShrink = true,
  className = '',
  ...props
}) => {


  return (
    <button
      className={`${isShrink ? "w-14 sm:w-[10.5rem] " : "w-[10.5rem] "}  cursor-pointer min-w-14 font-bold rounded-3xl border-slate-900 border-2 shadow-solid ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
