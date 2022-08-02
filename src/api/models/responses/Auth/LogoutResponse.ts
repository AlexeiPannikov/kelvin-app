export class LogoutResponse {
  message: string = "";

  constructor(obj?: Partial<LogoutResponse>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
