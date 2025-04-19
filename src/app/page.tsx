'use client';

import TodoForm from '@/components/todo/TodoForm';
import TodoList from '@/components/todo/TodoList';
import * as todoService from '@/lib/todoService';
import type { Todo } from '@/types/todo';
import React, { useEffect, useState } from 'react';

/**
 * 할 일 목록 페이지 (메인 페이지)
 * 모든 할 일을 관리하고 표시하는 메인 컴포넌트
 */
export default function HomePage() {
  // 상태 관리
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTodoEmpty, setIsTodoEmpty] = useState(false);

  /**
   * 서버에서 모든 할 일 목록을 가져오는 함수
   */
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await todoService.getAllTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('할 일 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 로드 시 할 일 목록 가져오기
  useEffect(() => {
    fetchTodos();
  }, []);

  // 할 일 목록이 비어있는지 체크
  useEffect(() => {
    setIsTodoEmpty(todos.length === 0);
  }, [todos]);

  /**
   * 새 할 일 추가 핸들러
   * @param name - 추가할 할 일의 제목
   */
  const handleAddTodo = async (name: string) => {
    try {
      setIsLoading(true);
      await todoService.createTodo({ name });
      fetchTodos();
    } catch (err) {
      setError('할 일을 추가하는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 할 일 완료 상태 토글 핸들러
   * @param id - 상태를 변경할 할 일 ID
   * @param isCompleted - 변경할 완료 상태
   */
  const handleToggleStatus = async (id: string, isCompleted: boolean) => {
    try {
      await todoService.updateTodo(id, { isCompleted });
      fetchTodos();
    } catch (err) {
      setError('할 일 상태를 변경하는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 할 일 목록을 진행 중과 완료로 분류
  const pendingTodos = todos.filter(todo => !todo.isCompleted);
  const completedTodos = todos.filter(todo => todo.isCompleted);

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-6">
      {/* 할 일 추가 섹션 */}
      <section className="mb-8">
        <h1 className="sr-only">할 일 관리</h1>
        
        {/* 할 일 추가 폼 */}
        <TodoForm 
          onSubmit={handleAddTodo} 
          isLoading={isLoading} 
          isTodoEmpty={isTodoEmpty}
        />
        
        {/* 에러 메시지 */}
        {error && (
          <div className="mt-4 p-3 bg-danger text-white rounded-md">
            {error}
          </div>
        )}
      </section>
      
      {/* 할 일 목록 섹션 */}
      <section className='flex md:flex-row flex-col gap-6'>
        {/* 진행 중인 할 일 목록 */}
        <div className='md:w-1/2 w-full'>
          <TodoList
            todos={pendingTodos}
            title="진행 중"
            isCompleted={false}
            onToggleStatus={handleToggleStatus}
            emptyMessage="진행 중인 할 일이 없습니다."
          />
        </div>
        
        {/* 완료된 할 일 목록 */}
        <div className='md:w-1/2 w-full'>
          <TodoList
            isCompleted={true}
            todos={completedTodos}
            title="완료"
            onToggleStatus={handleToggleStatus}
            emptyMessage="완료된 할 일이 없습니다."
          />
        </div>
      </section>
    </div>
  );
}