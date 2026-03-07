export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
}

export const successResponse = <T>(data: T, message?: string, meta?: any): ApiResponse<T> => ({
  success: true,
  message,
  data,
  meta,
});

export const errorResponse = (message: string): ApiResponse<null> => ({
  success: false,
  message,
});