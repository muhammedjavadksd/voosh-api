import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../data/enum/utilEnum";
import { validationResult } from "express-validator";


export function errorHandle(error: Error, req: Request, res: Response, next: NextFunction) {
    console.log("Global error");
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Something went wrong" })
}

export function notFound(req: Request, res: Response) {
    res.status(HttpStatus.NOT_FOUND).json({ status: false, msg: "API endpoint not found" })
}

export function validateRequest(req: Request, res: Response, next: NextFunction) {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({
            status: false,
            msg: isValid.array()[0]
        });
        return;
    }

    next()
}