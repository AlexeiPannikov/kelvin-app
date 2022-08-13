export class ResponseWithPagination<T> {
  current_page: number = null;
  data = new Array<T>();
  first_page_url: string = null;
  from: number = null;
  next_page_url: string = null;
  path: string = null;
  per_page: number = null;
  prev_page_url: null;
  to: number = null;
}
