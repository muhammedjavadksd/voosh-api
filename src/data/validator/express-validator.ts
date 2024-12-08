
import { body } from 'express-validator'

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