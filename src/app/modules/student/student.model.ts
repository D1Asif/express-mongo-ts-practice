import { Schema, model, connect } from 'mongoose';
import { Guardian, LocalGuardian, Student, UserName } from './student.interface';

const userNameSchema = new Schema<UserName>({
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
    },
});

const guardianSchema = new Schema<Guardian>({
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

const localGuardianSchema = new Schema<LocalGuardian>({
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

const studentSchema = new Schema<Student>({
    id: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true
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
        type: String,
        required: [true, 'Date of Birth is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
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
    isActive: {
        type: String,
        enum: {
            values: ['active', 'blocked'],
            message: "Status can be either 'active' or 'blocked'. {VALUE} is not supported"
        },
        default: 'active'
    },
});

export const StudentModel = model<Student>('Student', studentSchema);