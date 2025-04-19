export interface Todo {
  id: string;
  name: string;
  imageUrl: string;
  memo: string;
  isCompleted: boolean;
  tenantId: string;
}

export interface TodoCreateRequest {
  name: string;
}

export interface TodoUpdateRequest {
  name?: string;
  isCompleted?: boolean;
  memo?: string;
  imageUrl?: string;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
}