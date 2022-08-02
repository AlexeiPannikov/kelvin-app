export class UserModel {
    id: number = null;
    role_id: number = null;
    name: string = "";
    email: string = "";
    avatar: string = "";
    email_verified_at: string = null;
    settings: [] = [];
    created_at: string = null;
    updated_at: string = null;
    studio_id: number = null;
    is_master: number = 0;
    is_enabled: number = 0;
    login_at: string = null;

    constructor(obj?: Partial<UserModel>) {
        if (obj) {
            Object.assign(this, obj)
        }
    }
}
