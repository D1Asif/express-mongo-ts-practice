import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

const userSchema = new Schema<TUser, UserModel>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: 0
    },
    needsPasswordChange: {
        type: Boolean,
        default: true
    },
    passwordChangedAt: {
        type: Date
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'faculty'],
    },
    status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: "in-progress"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// pre save middleware/hook : will work on create()/save()
userSchema.pre('save', async function (next) {
    // console.log(this, "pre hook: we will save the data");
    const user = this;
    // hashing password and save into db
    user.password = await bcrypt.hash(user.password, Number(config.bcryptSaltRounds));

    next();
})

// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = ''

    next();
});

userSchema.statics.isUserExistByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password');
}

userSchema.statics.isPasswordMatched = async function (plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

userSchema.statics.isJWTIssuedBeforePasswordChange = function (passwordChangedTimestamp: Date, jwtIssuedTimestamp: number) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    
    return passwordChangedTime > jwtIssuedTimestamp; 
}

export const User = model<TUser, UserModel>("User", userSchema);