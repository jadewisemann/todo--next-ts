'use client';

import Image from 'next/image';
import type { FC, MouseEvent } from 'react';

/**
 * 체크박스 컴포넌트의 Props 인터페이스
 * @property checked - 체크 상태
 * @property onChange - 상태 변경 핸들러
 * @property label - 체크박스 옆에 표시할 텍스트 (선택사항)
 * @property className - 추가 스타일 클래스 (선택사항)
 */
interface CheckboxProps {
  checked: boolean;
  onChange: (e: MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  className?: string;
}

/**
 * 할 일 완료 여부를 표시하는 커스텀 체크박스 컴포넌트
 * 버튼을 기반으로 구현하여 렌더링 문제 해결
 * 
 * @param checked - 체크 상태
 * @param onChange - 상태 변경 핸들러
 * @param label - 체크박스 옆에 표시할 텍스트
 * @param className - 추가 스타일 클래스
 * @returns 스타일링된 체크박스 컴포넌트
 */
const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = ''
}) => {
  // 체크 상태에 따른 아이콘 경로
  const iconSrc = checked ? "/ico__checked.svg" : "/ico__empty.svg";
  const altText = checked ? "checked" : "empty";
  
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={onChange}
        aria-checked={checked}
        className="flex items-center focus:outline-none cursor-pointer"
      >
        <Image 
          src={iconSrc} 
          alt={altText} 
          width={24} 
          height={24} 
        />
        {label && <span className="ml-2">{label}</span>}
      </button>
    </div>
  );
};

export default Checkbox;