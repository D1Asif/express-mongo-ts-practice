import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        // check if the token is sent from the client
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        // check if the token is valid
        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

        const { userId, role, iat } = decoded;

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

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        req.user = decoded as JwtPayload;

        next();
    })
}

export default auth;