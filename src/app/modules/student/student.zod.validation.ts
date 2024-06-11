import { z } from 'zod';

// Schema for UserName
const userNameValidationSchema = z.object({
    firstName: z.string()
        .trim()
        .max(20, "First name cannot be more than 20 characters")
        .min(1, "First name is required")
        .regex(/^[A-Z][a-z]*$/, { message: "First name must be capitalized" })
        .refine(value => value.charAt(0).toUpperCase() + value.slice(1) === value, {
            message: "{VALUE} is not in capitalized format"
        }),
        
    middleName: z.string().optional(),
    lastName: z.string()
        .min(1, "Last name is required")
        .refine(value => /^[A-Za-z]+$/.test(value), {
            message: "{VALUE} needs to be alpha chars only"
        })

});

// Schema for Guardian
const guardianValidationSchema = z.object({
    fatherName: z.string().min(1, "Father name is required"),
    fatherOccupation: z.string().min(1, "Father occupation is required"),
    fatherContactNo: z.string().min(1, "Father contact number is required"),
    motherName: z.string().min(1, "Mother name is required"),
    motherOccupation: z.string().min(1, "Mother occupation is required"),
    motherContactNo: z.string().min(1, "Mother contact number is required"),
});

// Schema for LocalGuardian
const localGuardianValidationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    occupation: z.string().min(1, "Occupation is required"),
    contactNo: z.string().min(1, "Contact number is required"),
    address: z.string().min(1, "Address is required"),
});

// Schema for Student
const studentValidationSchema = z.object({
    id: z.string().min(1, "Student ID is required"),
    password: z.string().max(20, "Password cannot be more than 20 characters long"),
    name: userNameValidationSchema.refine(value => value !== undefined, "Name is required"),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
    email: z.string().email("The provided email address is not a valid email address").min(1, "Email is required"),
    contactNo: z.string().min(1, "Contact number is required"),
    emergencyContactNo: z.string().min(1, "Emergency contact number is required"),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    presentAddress: z.string().min(1, "Present address is required"),
    permanentAddress: z.string().min(1, "Permanent address is required"),
    guardian: guardianValidationSchema.refine(value => value !== undefined, "Guardian information is required"),
    localGuardian: localGuardianValidationSchema.refine(value => value !== undefined, "Local guardian information is required"),
    profileImg: z.string().optional(),
    isActive: z.enum(['active', 'blocked']).default('active'),
    isDeleted: z.boolean()
});

export default studentValidationSchema;