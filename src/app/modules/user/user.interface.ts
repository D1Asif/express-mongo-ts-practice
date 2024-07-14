import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
    id: string;
    password: string;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    role: 'student' | 'admin' | 'faculty';
    status: 'in-progress' | 'blocked';
    isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
    isUserExistByCustomId(id: string): Promise<TUser>,
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>,
    isJWTIssuedBeforePasswordChange(passwordChangedTimestamp: Date, jwtIssuedTimestamp: number): boolean
}

export type TUserRole = keyof typeof USER_ROLE;