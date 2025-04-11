import { NextFunction,Request,Response } from "express";
import logger from "../util/logger";


const requestLogger = (req:Request, res:Response, next:NextFunction) => {
    const startTime = Date.now();
    //use this logger when response is finished 
    //to achieve correct status code
    res.on('finish', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const status = res.statusCode;
        const { method, originalUrl } = req;
        const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    logger.log({
        level: level,
        message: `${method} ${status} ${originalUrl} ${duration}ms`,
    });
    });
   

next();
}

export default requestLogger;
