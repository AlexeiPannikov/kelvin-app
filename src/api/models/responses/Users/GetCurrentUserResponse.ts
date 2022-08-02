export class GetCurrentUserResponse {
  id: number = null;
  role_id: number = null;
  name: string = "";
  email: string = "";
  avatar: string = "";
  email_verified_at: string = null;
  settings: {
    locale: "";
  };
  created_at: string = "";
  updated_at: string = "";
  studio_id: number = null;
  is_master: number = null;
  is_enabled: number = null;
  login_at: number = null;
}
