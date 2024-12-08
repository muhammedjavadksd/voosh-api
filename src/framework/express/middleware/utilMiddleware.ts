import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../data/enum/utilEnum";


export function errorHandle(error: Error, req: Request, res: Response, next: NextFunction) {
    console.log("Global error");
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Something went wrong" })
}

export function notFound(req: Request, res: Response) {
    res.status(HttpStatus.NOT_FOUND).json({ status: false, msg: "API endpoint not found" })
}