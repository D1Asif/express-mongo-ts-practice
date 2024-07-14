import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken } from "./auth.util";

const loginUser = async (payload: TLoginUser) => {
    // check if the user exists
    const user = await User.isUserExistByCustomId(payload.id)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // check if the user is deleted
    const isDeleted = user.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "The user is deleted!");
    }

    // check if the user is blocked
    const userStatus = user.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, "The user is blocked!");
    }

    // check if the password is correct
    if (!(await User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError(httpStatus.FORBIDDEN, "Passwords do not match!")
    }

    // create token and send to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role
    }

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user.needsPasswordChange
    };
}

const changePassword = async (userData: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {
    // check if the user exists
    console.log(userData);
    const user = await User.isUserExistByCustomId(userData.userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // check if the user is deleted
    const isDeleted = user.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "The user is deleted!");
    }

    // check if the user is blocked
    const userStatus = user.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, "The user is blocked!");
    }

    // check if the password is correct
    if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
        throw new AppError(httpStatus.FORBIDDEN, "Passwords do not match!")
    }

    // hash new password
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcryptSaltRounds))

    await User.findOneAndUpdate(
        {
            id: userData.userId,
            role: userData.role
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date()
        }
    )

    return null;
}

const refreshToken = async (token: string) => {
    // check if the token is sent from the client
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
    }

    // check if the token is valid
    const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload;

    const { userId, iat } = decoded;

    // check if the user exists
    const user = await User.isUserExistByCustomId(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // check if the user is deleted
    const isDeleted = user.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "The user is deleted!");
    }

    // check if the user is blocked
    const userStatus = user.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, "The user is blocked!");
    }

    if (user?.passwordChangedAt && User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
    }

    // create token and send to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role
    }

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    return {
        accessToken
    }
}

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken
}