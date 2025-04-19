'use client';

import Button from '@/components/commons/Button';
import TodoItem from '@/components/todo/TodoItem';
import * as todoService from '@/lib/todoService';
import type { Todo } from '@/types/todo';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface TodoDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * 할 일 상세 페이지 컴포넌트
 * 특정 할 일의 세부 정보를 보고 편집할 수 있는 페이지
 */
export default function TodoDetailPage({ params }: TodoDetailPageProps) {
  // 파라미터에서 할 일 ID 추출
  const { id } = params;

  const router = useRouter();
  
  // 상태 관리
  const [todo, setTodo] = useState<Todo | null>(null);
  const [name, setName] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // 텍스트영역 자동 높이 조절을 위한 ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * 할 일 데이터를 서버에서 가져오는 함수
   */
  const fetchTodo = async () => {
    try {
      setIsLoading(true);
      const data = await todoService.getTodoById(id);
      
      // 가져온 데이터로 상태 업데이트
      setTodo(data);
      setName(data.name);
      setIsCompleted(data.isCompleted || false);
      setMemo(data.memo || '');
      setImage(data.imageUrl || null);
    } catch (err) {
      setError('할 일을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // ID가 변경될 때마다 할 일 정보 가져오기
  useEffect(() => {
    fetchTodo();
  }, [id]);

  // 메모 내용이 변경될 때마다 텍스트영역 높이 자동 조절
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    // 높이 초기화 후 내용에 맞게 조정
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, el.parentElement!.clientHeight)}px`;

    // 스크롤 필요 여부 결정
    el.style.overflowY = el.scrollHeight > el.clientHeight ? 'auto' : 'hidden';
  }, [memo]);

  /**
   * 이미지 파일 유효성 검사 함수
   * @param file - 검사할 이미지 파일
   * @returns 유효성 검사 통과 여부
   */
  const validateImageFile = (file: File) => {
    setImageError(null);
    
    // 파일 이름이 영어, 숫자, 특수문자로만 이루어져 있는지 확인
    if (!/^[a-zA-Z0-9._\-\s]+$/.test(file.name)) {
      setImageError('파일 이름은 영어, 숫자, 공백, 점, 대시, 밑줄만 포함해야 합니다.');
      return false;
    }
    
    // 파일 크기가 5MB 이하인지 확인
    if (file.size > 5 * 1024 * 1024) {
      setImageError('파일 크기는 5MB 이하여야 합니다.');
      return false;
    }
    
    return true;
  };

  /**
   * 이미지 파일 변경 처리 핸들러
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  /**
   * 할 일 삭제 처리 핸들러
   */
  const handleDelete = async () => {
    if (confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      try {
        setIsLoading(true);
        await todoService.deleteTodo(id);
        router.push('/'); // 삭제 후 홈으로 이동
      } catch (err) {
        setError('할 일을 삭제하는데 실패했습니다. 다시 시도해주세요.');
        setIsLoading(false);
      }
    }
  };

  /**
   * 할 일 수정 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // 기본 정보 업데이트
      await todoService.updateTodo(id, {
        name,
        isCompleted,
        memo: memo || undefined
      });
      
      // 이미지 파일이 있으면 업로드
      if (imageFile) {
        const updatedTodo = await todoService.uploadImage(id, imageFile);
        setTodo(updatedTodo);
        setImage(updatedTodo.imageUrl || null);
      }
      
      setIsLoading(false);
      setError('할 일이 성공적으로 수정되었습니다!');
      router.push('/'); // 수정 후 홈으로 이동
    } catch (err) {
      setError('할 일을 수정하는데 실패했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  /**
   * 할 일 완료 상태 토글 핸들러
   */
  const handleToggleStatus = async (id: string, isCompleted: boolean) => {
    try {
      await todoService.updateTodo(id, { isCompleted });
      fetchTodo();
    } catch (err) {
      setError('할 일 상태를 변경하는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 로딩 중 표시
  if (isLoading && !todo) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  // 에러 표시
  if (error && !todo) {
    return (
      <div className="text-center py-10">
        <p className="text-danger mb-4">{error}</p>
        <Button onClick={() => router.push('/')}>목록으로 돌아가기</Button>
      </div>
    );
  }
  
  // 할 일 데이터가 없는 경우
  if (!todo) {
    return <div className="text-center py-10">할 일을 불러오는 중입니다...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white min-h-screen md:px-25">
      <h1 className="sr-only">할 일 수정</h1>
      
      <form onSubmit={handleSubmit}>
        {/* 할 일 항목 표시 */}
        <div className='mb-6'>
          <TodoItem 
            todo={todo} 
            key={todo.id} 
            onToggleStatus={handleToggleStatus} 
            isTitle={true} 
          />
        </div>
        
        {/* 이미지와 메모 영역 */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 min-h-74">
          {/* 이미지 영역 */}
          <div className="w-full md:w-2/5 h-74">
            <div className="rounded-3xl border-2 border-slate-200 border-dotted h-full flex items-center justify-center relative bg-slate-100">
              {/* 이미지 표시 또는 기본 아이콘 */}
              {image ? (
                <img
                  src={encodeURI(image)}
                  alt="이미지 미리보기"
                  className="w-full h-full object-cover rounded-3xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Image src="/ico__img.svg" width={64} height={64} alt="이미지 아이콘" />
                </div>
              )}
              
              {/* 이미지 추가/변경 버튼 */}
              <div className="absolute bottom-3 right-3">
                <label
                  htmlFor="image-upload"
                  className="w-16 h-16 bg-slate-200 flex items-center justify-center rounded-full cursor-pointer text-4xl"
                >
                  <Image src="/ico__plus.svg" width={18} height={18} alt="추가" />
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            {/* 이미지 오류 메시지 */}
            {imageError && <p className="text-danger text-xs mt-1">{imageError}</p>}
          </div>
          
          {/* 메모 영역 */}
          <div className="w-full md:w-3/5 rounded-3xl p-4 bg-[url(/img__memo.svg)] flex flex-col items-center h-74">
            <h3 className="text-amber-800 font-extrabold">Memo</h3>

            <div className="grow w-full flex justify-center items-center">
              <textarea
                ref={textareaRef}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="custom-scrollbar bg-transparent border-none resize-none focus:outline-none text-gray-600 text-center w-full overflow-x-hidden"
                placeholder="오늘의 할 일을 메모해보세요."
                rows={1}
              />
            </div>
          </div>
        </div>
        
        {/* 액션 버튼 영역 */}
        <div className="flex justify-center md:justify-end gap-4 h-14">
          {/* 수정 완료 버튼 */}
          <Button  
            isShrink={false} 
            type='submit' 
            disabled={isLoading} 
            onClick={handleSubmit} 
            className={`text-slate-900 ${isCompleted ? "bg-lime-300" : "bg-slate-200"}`}
          >
            <div className='flex items-center justify-center gap-1'>
              <Image src="/ico__check.svg" width={16} height={16} alt="check" />
              <span>수정 완료</span>
            </div>
          </Button>
          
          {/* 삭제 버튼 */}
          <Button  
            isShrink={false}
            type='button'
            disabled={isLoading} 
            onClick={handleDelete} 
            className='bg-rose-500 text-white'
          >
            <div className='flex items-center justify-center gap-1'>
              <Image src="/ico__x.svg" width={16} height={16} alt="delete" />
              <span>삭제 하기</span>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}