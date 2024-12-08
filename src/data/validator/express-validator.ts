
import { body } from 'express-validator'
import { UserRole } from '../enum/utilEnum'

export const signUpValidator = [
    body("email").isEmail().withMessage("Please provide valid email address").notEmpty().withMessage("Email id is required"),
    body("password").isEmail().withMessage("Please provide valid email address").notEmpty().withMessage("Email id is required")
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character'),
]

export const signInValidator = [
    body("email").isEmail().withMessage("Please provide valid email address").notEmpty().withMessage("Email id is required"),
    body("password").isEmail().withMessage("Please provide valid email address").notEmpty().withMessage("Email id is required")
]

export const addUserValidator = [
    body("email").isEmail().withMessage("Please provide valid email address").notEmpty().withMessage("Email id is required"),
    body("password").isEmail().withMessage("Please provide valid email address").notEmpty().withMessage("Email id is required"),
    body("role").isIn(Object.values(UserRole)).withMessage("Please provide valid role").notEmpty().withMessage("Role is required")
]