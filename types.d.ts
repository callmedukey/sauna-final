declare type ActionResponse<T = undefined> = Promise<{
  success: boolean;
  message: string;
  data?: T;
}>;
