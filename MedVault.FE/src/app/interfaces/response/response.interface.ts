export interface ResponseModel<T> {
  result: boolean;
  statusCode: number;
  messages: string;
  data: T;
}
