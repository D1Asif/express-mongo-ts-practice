import Joi from "joi";

// creating schema validation with joi
const userNameValidationSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .max(20)
        .required()
        .regex(/^[A-Z][a-z]*$/)
        .messages({
            'string.pattern.base': '{#label} is not in capitalized format',
            'string.max': 'First name cannot be more than 20 characters',
            'any.required': 'First name is required',
        }),
    middleName: Joi.string().allow(null, ''),
    lastName: Joi.string()
        .required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.pattern.base': '{#label} needs to be alpha chars only',
            'any.required': 'Last name is required',
        })
});

// Schema for Guardian
const guardianValidationSchema = Joi.object({
    fatherName: Joi.string().required(),
    fatherOccupation: Joi.string().required(),
    fatherContactNo: Joi.string().required(),
    motherName: Joi.string().required(),
    motherOccupation: Joi.string().required(),
    motherContactNo: Joi.string().required()
});

// Schema for LocalGuardian
const localGuardianValidationSchema = Joi.object({
    name: Joi.string().required(),
    occupation: Joi.string().required(),
    contactNo: Joi.string().required(),
    address: Joi.string().required()
});

// Schema for Student
const studentValidationSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'Student ID is required'
    }),
    name: userNameValidationSchema.required().messages({
        'any.required': 'Name is required'
    }),
    gender: Joi.string()
        .valid('male', 'female', 'other')
        .required()
        .messages({
            'any.only': 'Gender can be one of the following: male, female, other. {#value} is not supported',
            'any.required': 'Gender is required'
        }),
    dateOfBirth: Joi.string().required().messages({
        'any.required': 'Date of Birth is required'
    }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': '{#value} is not a valid email address',
            'any.required': 'Email is required'
        }),
    contactNo: Joi.string().required().messages({
        'any.required': 'Contact number is required'
    }),
    emergencyContactNo: Joi.string().required().messages({
        'any.required': 'Emergency contact number is required'
    }),
    bloodGroup: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .messages({
            'any.only': "Blood group must be one of 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'. {#value} is not supported"
        }),
    presentAddress: Joi.string().required().messages({
        'any.required': 'Present address is required'
    }),
    permanentAddress: Joi.string().required().messages({
        'any.required': 'Permanent address is required'
    }),
    guardian: guardianValidationSchema.required().messages({
        'any.required': 'Guardian information is required'
    }),
    localGuardian: localGuardianValidationSchema.required().messages({
        'any.required': 'Local guardian information is required'
    }),
    profileImg: Joi.string().optional(),
    isActive: Joi.string()
        .valid('active', 'blocked')
        .default('active')
        .messages({
            'any.only': "Status can be either 'active' or 'blocked'. {#value} is not supported"
        })
});

export default studentValidationSchema;