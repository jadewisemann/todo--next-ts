'use client';

import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

/**
 * 재사용 가능한 입력 필드 컴포넌트
 * 
 * @param color - 입력 필드 색상 테마
 * @param label - 입력 필드 레이블
 * @param error - 에러 메시지
 * @param className - 추가 스타일 클래스
 * @param children - 자식 요소
 * @param props - 기타 HTML 입력 속성들
 * @returns 스타일링된 입력 필드 컴포넌트
 */
const Input: React.FC<InputProps> = ({
  color,
  label,
  error,
  className = '',
  children,
  ...props
}) => {
  // 고유 ID 생성
  const inputId = React.useId();
  // 스타일링
  const defaultClass = "border-2 grow flex px-6 rounded-3xl shadow-solid"
  // 색상에 따른 클래스 결정
  const primeColor = "bg-slate-100 border-slate-900"
  const secondColor = "bg-slate-100 border-slate-900"

  const classes = `${defaultClass} ${color === 'prime' ? primeColor : color === 'second' ? secondColor : " " }`

  return (
    <div className={classes} >
      {label && (
        <label htmlFor={inputId}  className="block text-gray-700 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full outline-none bg-transparent
          ${className}
          ${error ? 'border-danger' : 'border-gray-300'}
          `
        }
        {...props}
      />
      {error && <p className="mt-1 text-danger text-xs">{error}</p>}
    </div>
  );
};

export default Input;