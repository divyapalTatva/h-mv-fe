import { UserRole } from "../../shared/enums/common-enum";

export interface LoginRequest {
    email: string;
    password: string;
    role: UserRole;
}