import { Schema, model } from 'mongoose';
import { StudentModel, TGuardian, TLocalGuardian, TStudent, TUserName } from './student.interface';
import { isAlpha, isEmail } from 'validator';

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [20, "first name cannot be more than 20 characters"],
        validate: {
            validator: function (value: string) {
                const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
                return formattedValue === value;
            },
            message: "{VALUE} is not in capitalized format"
        }
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        validate: {
            validator: (value: string) => isAlpha(value),
            message: "{VALUE} needs to be alpha chars only"
        }
    },
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: {
        type: String,
        required: true,
    },
    fatherOccupation: {
        type: String,
        required: true,
    },
    fatherContactNo: {
        type: String,
        required: true,
    },
    motherName: {
        type: String,
        required: true,
    },
    motherOccupation: {
        type: String,
        required: true,
    },
    motherContactNo: {
        type: String,
        required: true,
    },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
})

const studentSchema = new Schema<TStudent, StudentModel>({
    id: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "User Id is required"],
        unique: true,
        ref: 'User'
    },
    name: {
        type: userNameSchema,
        required: [true, 'Name is required'],
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: "Gender can be one of the following: male, female, other. {VALUE} is not supported"
        },
        required: [true, 'Gender is required']
    },
    dateOfBirth: {
        type: Date
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: (value: string) => isEmail(value),
            message: "{VALUE} is not a valid email address"
        }
    },
    contactNo: {
        type: String,
        required: [true, 'Contact number is required']
    },
    emergencyContactNo: {
        type: String,
        required: [true, 'Emergency contact number is required']
    },
    bloodGroup: {
        type: String,
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: "Blood group must be one of 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'. {VALUE} is not supported"
        },
    },
    presentAddress: {
        type: String,
        required: [true, 'Present address is required']
    },
    permanentAddress: {
        type: String,
        required: [true, 'Permanent address is required']
    },
    guardian: {
        type: guardianSchema,
        required: [true, 'Guardian information is required']
    },
    localGuardian: {
        type: localGuardianSchema,
        required: [true, 'Local guardian information is required']
    },
    profileImg: {
        type: String
    },
    admissionSemester: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicSemester'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: {
        virtuals: true
    }
});

studentSchema.virtual('fullName').get(function() {
    return this.name.firstName + " " + this.name.middleName + " " + this.name.lastName;
})

// Query middleware
studentSchema.pre('find', function(next) {
    this.find({isDeleted: {$ne: true}})

    next();
})

studentSchema.pre('findOne', function(next) {
    this.find({isDeleted: {$ne: true}})

    next();
});

studentSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match: {isDeleted: {$ne: true}}})

    next();
});

// creating static method
studentSchema.statics.isUserExists = async function(id: string) {
    const existingStudent = await Student.findOne({id});

    return existingStudent;
}

export const Student = model<TStudent, StudentModel>('Student', studentSchema);