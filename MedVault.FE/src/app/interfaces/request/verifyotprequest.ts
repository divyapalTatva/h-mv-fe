import { UserRole } from "../../shared/enums/common-enum";

export interface VerifyOtpRequest {
    userID: string;
    otpCode: string;
    role: UserRole;
}