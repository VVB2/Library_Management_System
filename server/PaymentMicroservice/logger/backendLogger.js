import * as dotenv from 'dotenv';
dotenv.config();
import * as winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, splat } = winston.format;

/**
 * To store the log in a well formated and documented manner.
 */
const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
    return `${timestamp} | [${level.toUpperCase()}] | ${message} ${JSON.stringify(metadata) !== "{}"? `| ${JSON.stringify(metadata)}`: ''}`;
});

/**
 * Creates a new transport(configuration) about the location, size and name of the 
 * log file that needs to contain all the logs
 */
const transport = new winston.transports.DailyRotateFile(
    {
        filename: process.env.LOG_FOLDER + process.env.LOG_FILENAME,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '12d',
        maxSize: '10m',
        prepend: true,
        level: 'http',
    },
);

transport.on('rotate', function(oldFilename, newFilename) {
    console.log(`Rotated ${oldFilename} with ${newFilename}`);
});

/**
 * To create a logger to log all the activities that are taking place on the backend.
 * Very useful for finding out any bugs or glitches in the system.
 * Also if the server is not slowing down.
 */
const backendLogger = () => {
    return winston.createLogger({
        level: 'http',
        exitOnError: false,
        exceptionHandlers: [
            new winston.transports.File({ filename: process.env.LOG_FOLDER + 'exception.log' }),
        ],
        rejectionHandlers: [
            new winston.transports.File({ filename: process.env.LOG_FOLDER + 'rejections.log' }),
        ],
        format: combine(
            timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
            splat(),
            myFormat
        ),
        transports: [
          transport,
        ],
    });
}

export default backendLogger;