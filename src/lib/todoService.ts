'use server';

import type { Todo, TodoCreateRequest, TodoUpdateRequest } from '@/types/todo';

// 환경 변수
const TENANT_ID = 'amFkZXdpc2VtYW5u';
const BASE_URL = `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}`;

// API 기본 옵션
const API_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
  },
  cache: 'no-store' as const,
};

/**
 * API 응답 데이터 처리 헬퍼 함수
 * @param response - Fetch API 응답 객체
 * @returns 처리된 데이터
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    console.error(`API 응답 오류: ${response.status}`);
    throw new Error(`API error: ${response.status}`);
  }
  
  const jsonData = await response.json();
  
  return jsonData as T;
}

/**
 * 모든 할 일 목록 조회
 * @returns 할 일 목록 배열
 */
export async function getAllTodos(): Promise<Todo[]> {
  try {
    const response = await fetch(`${BASE_URL}/items`, API_OPTIONS);
    const data = await handleApiResponse<Todo[]>(response);
    return data;
  } catch (error) {
    console.error('할 일 목록 조회 실패:', error);
    throw error;
  }
}

/**
 * 단일 할 일 조회
 * @param id - 조회할 할 일 ID
 * @returns 할 일 객체
 */
export async function getTodoById(id: string): Promise<Todo> {
  try {
    const response = await fetch(`${BASE_URL}/items/${id}`, API_OPTIONS);
    return await handleApiResponse<Todo>(response);
  } catch (error) {
    console.error(`ID ${id} 할 일 조회 실패:`, error);
    throw error;
  }
}

/**
 * 새 할 일 생성
 * @param todo - 생성할 할 일 정보
 * @returns 생성된 할 일 객체
 */
export async function createTodo(todo: TodoCreateRequest): Promise<Todo> {
  try {
    
    const requestBody = {
      name: todo.name
    };
    
    const response = await fetch(`${BASE_URL}/items`, {
      ...API_OPTIONS,
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    
    const data = await handleApiResponse<Todo>(response);
    console.log('할 일 생성 완료:', data);
    return data;
  } catch (error) {
    console.error('할 일 생성 실패:', error);
    throw error;
  }
}

/**
 * 할 일 업데이트
 * @param id - 업데이트할 할 일 ID
 * @param todo - 업데이트할 내용
 * @returns 업데이트된 할 일 객체
 */
export async function updateTodo(id: string, todo: TodoUpdateRequest): Promise<Todo> {
  try {
    console.log(`할 일 업데이트: ID ${id}`, todo);
    
    const requestBody: Partial<TodoUpdateRequest> = {};
    
    if (todo.name !== undefined) requestBody.name = todo.name;
    if (todo.isCompleted !== undefined) requestBody.isCompleted = todo.isCompleted;
    if (todo.memo !== undefined) requestBody.memo = todo.memo;
    if (todo.imageUrl !== undefined) requestBody.imageUrl = todo.imageUrl;
    
    const response = await fetch(`${BASE_URL}/items/${id}`, {
      ...API_OPTIONS,
      method: 'PATCH',
      body: JSON.stringify(requestBody),
    });
    
    return await handleApiResponse<Todo>(response);
  } catch (error) {
    console.error(`ID ${id} 할 일 업데이트 실패:`, error);
    throw error;
  }
}

/**
 * 할 일 삭제
 * @param id - 삭제할 할 일 ID
 */
export async function deleteTodo(id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    console.log(`ID ${id} 할 일 삭제 완료`);
  } catch (error) {
    console.error(`ID ${id} 할 일 삭제 실패:`, error);
    throw error;
  }
}

/**
 * 이미지 업로드
 * @param id - 이미지를 첨부할 할 일 ID
 * @param file - 업로드할 이미지 파일
 * @returns 업데이트된 할 일 객체
 */
export async function uploadImage(id: string, file: File): Promise<Todo> {
  try {
    
    const formData = new FormData();
    formData.append('image', file);
    
    // 이미지 업로드
    const uploadResponse = await fetch(`${BASE_URL}/images/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Image upload API error: ${uploadResponse.status}`);
    }
    
    const uploadData = await uploadResponse.json();
    
    // 이미지 URL 추출
    if (!uploadData?.url) {
      throw new Error('이미지 URL을 찾을 수 없습니다');
    }
    
    const imageUrl = uploadData.url;
    
    // 할 일 항목 업데이트
    return await updateTodo(id, { imageUrl });
  } catch (error) {
    console.error(`ID ${id} 이미지 업로드 실패:`, error);
    throw error;
  }
}