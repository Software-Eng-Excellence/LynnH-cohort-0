import config from "../config";
import winston from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';

const {isDev ,logDir} = config

//configure rolling log files
const logFileRotate = new DailyRotateFile({
    filename: 'logs/%DATE%-combined.log', 
    datePattern: 'YYYY-MM-DD', 
    maxSize: '10m', //max size of the log file
    maxFiles: '7d' ,  // Keeps logs for 7 days, then deletes old ones
    auditFile: 'audit.json' // disable audit file
});

const logFileFormat = winston.format.combine(
    //add timestamp
    winston.format.timestamp(),
    //data format json
    winston.format.json(),
    //not recommended using pretty printing
    //winston.format.prettyPrint()
    // Enables string interpolation like %s %d
    winston.format.splat(),
    // Ensure full error details
    winston.format.errors({ stack: true })
)

const logConsoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {

        return `${timestamp} [${level}]: ${message} ${stack ? '\n' + stack : ''}`
    })
)

//log levels
// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     verbose: 3,
//     debug: 4,
//     silly: 5,
// }

const logger = winston.createLogger({
    level: 'info',
    transports: [
        logFileRotate,
        //show logs in console (terminal)
        // new winston.transports.Console({ format: logConsoleFormat }),
        //show logs in files error.log when we have error
        new winston.transports.File({ filename: 'error.log', level: 'error',  dirname: logDir, format: logFileFormat }),
        //show logs in files combined.log for all logs
        new winston.transports.File({ filename: 'combined.log', dirname: logDir, format: logFileFormat }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log', dirname: logDir, format: logFileFormat }),
    ],


});
//if we're in the development mode we want to see the logs in the console + debug level
if (isDev) {
    logger.add(new winston.transports.Console({ format: logConsoleFormat }))
    logger.level = 'debug'
}

export default logger