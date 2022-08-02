export class BaseResponse<T> {
  success: boolean = false;
  data: T;
}
