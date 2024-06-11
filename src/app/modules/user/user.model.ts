import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

const userSchema = new Schema<TUser>({
    id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    needsPasswordChange: {
        type: Boolean,
        default: true
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
})

export const User = model<TUser>("User", userSchema);