import type { Iadmin } from "../../Interface/admin/admin.models.interface";
import type { Iuser } from "../../Interface/user/user.models.interface";

export interface IadminRepository {
    createAdmin(email:string,name:string,password:string,role:string): Promise<Iadmin>;
    getUserByEmail(email: string): Promise<Iuser | null>;
}
