'use client';

import Image from 'next/image';
import { type FC, type FormEvent, type KeyboardEvent, useState } from 'react';
import Button from '../commons/Button';
import Input from '../commons/Input';


interface TodoFormProps {
  onSubmit: (title: string) => Promise<void>;
  isLoading?: boolean;
  isTodoEmpty?: boolean;
}

/**
 * 새로운 할 일 추가 폼 컴포넌트
 * 
 * @param onSubmit - 할 일 추가 제출 핸들러
 * @param isLoading - 로딩 상태
 * @param isTodoEmpty - 할 일 목록이 비어있는지 여부
 * @returns 할 일 입력 폼 컴포넌트
 */
const TodoForm: FC<TodoFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  isTodoEmpty 
}) => {
  const [title, setTitle] = useState('');
  
  /**
   * 폼 제출 핸들러
   * @param e - 폼 이벤트
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      await onSubmit(trimmedTitle);
      setTitle('');
    }
  };
  
  /**
   * 키 입력 이벤트 핸들러 - Enter 키로 제출
   * @param e - 키보드 이벤트
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (title.trim()) {
        handleSubmit(e);
      }
    }
  };
  
  // 아이콘 경로 및 스타일 결정
  const iconSrc = isTodoEmpty ? "/ico__plus--white.svg" : "/ico__plus--black.svg";
  const buttonBgColor = isTodoEmpty ? "bg-violet-600" : "bg-slate-200";
  const textColor = isTodoEmpty ? "text-white" : "text-slate-900";
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-4 h-14">
      <Input
        color="prime"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일을 입력해주세요"
        disabled={isLoading}
        aria-label="할 일 입력"
      />
      <Button
        type="submit"
        disabled={!title.trim() || isLoading}
        className={`whitespace-nowrap ${buttonBgColor} flex justify-center items-center`}
      >
        <div className="w-fit flex gap-1">
          <Image 
            src={iconSrc} 
            width={16} 
            height={16} 
            alt="할 일 추가" 
          />
          <span className={`sm:inline hidden ${textColor}`}>
            추가하기
          </span>
        </div>
      </Button>
    </form>
  );
};

export default TodoForm;