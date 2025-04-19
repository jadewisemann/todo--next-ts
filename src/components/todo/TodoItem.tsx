'use client';

import type { Todo } from '@/types/todo';
import Link from 'next/link';
import type React from 'react';
import Checkbox from '../commons/Checkbox';

interface TodoItemProps {
  todo: Todo;
  isTitle: boolean;
  onToggleStatus: (id: string, done: boolean) => void;
}

/**
 * 개별 할 일 항목 컴포넌트
 * 
 * @param todo - 할 일 객체
 * @param onToggleStatus - 완료 상태 토글 핸들러
 * @param isTitle - 제목으로 표시할지 여부 (기본값: false)
 * @returns 할 일 항목 컴포넌트
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleStatus, isTitle = false }) => {
  const handleToggle = () => {
    onToggleStatus(todo.id, !todo.isCompleted);
  };
  
  return (
    <div className={`flex px-3 py-2 h-12.5 items-center border-2 rounded-[27px] border-slate-900 justify-center ${todo.isCompleted && "bg-violet-100"}`}>
      <Checkbox 
        checked={todo.isCompleted} 
        onChange={handleToggle}
        />

      <Link href={`/items/${todo.id}`} className={`${!isTitle && "flex-1"} ml-4 cursor-pointer`}>
        <span className={`text-md ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'} ${isTitle && "underline font-bold"}`}>
          {todo.name}
        </span>
      </Link>
    </div>
  );
};

export default TodoItem;