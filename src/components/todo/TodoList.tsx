'use client';

import type { Todo } from '@/types/todo';
import Image from 'next/image';

import type React from 'react';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  title: string;
  isCompleted: boolean
  onToggleStatus: (id: string, done: boolean) => void;
  emptyMessage?: string;
}

/**
 * 할 일 목록 컴포넌트
 * 
 * @param todos - 할 일 배열
 * @param title - 섹션 제목 (예: "진행 중" 또는 "완료")
 * @param isCompleted - 완료된 할 일 목록인지 여부
 * @param onToggleStatus - 할 일 상태 토글 핸들러
 * @returns 할 일 목록 컴포넌트
 */
const TodoList: React.FC<TodoListProps> = ({
  todos,
  title,
  isCompleted,
  onToggleStatus,
}) => {
  // 헤더 이미지 정의
  const pendingHeader = <img src="./todo.svg" alt='to do' />;
  const completeHeader = <img src="./done.svg" alt='to do' />;
  
  // 빈 목록 확인
  const isEmpty = Array.isArray(todos) && todos.length === 0;
  
  // 빈 목록 표시 관련 설정
  const emptyImgSrc = isCompleted
    ? './img__empty__done--lg.svg'
    : './img__empty__todo--lg.svg';

  const emptyText = isCompleted
    ? ['아직 다 한 일이 없어요.', '해야 할 일을 체크해보세요!']
    : ['할 일이 없어요.', 'TODO를 새롭게 추가해주세요!'];

  // 빈 목록 표시 컴포넌트
  const EmptyState = () => (
    <div className="text-center flex flex-col justify-center items-center gap-6">
      <div className="w-60 h-60">
        <img src={emptyImgSrc} alt={isCompleted ? "완료된 일 없음" : "할 일 없음"} />
      </div>
      <div>
        {emptyText.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <h2 className="sr-only">{title}</h2>
      <div className="mb-4">{isCompleted ? completeHeader : pendingHeader}</div>
      <div className="flex flex-col gap-4">
        {!isEmpty ? (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleStatus={onToggleStatus}
              isTitle={false}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
};

export default TodoList;