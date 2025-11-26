export interface IResponse<T> {
  message: string;
  data: T;
}

export interface IPagination<T> {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  items: T[];
}

export type IPaginationResponse<T> = IResponse<IPagination<T>>;
