import * as dotenv from 'dotenv';
dotenv.config();
import * as winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
    /**
     * To store the log in a well formated and documented manner.
     */
    return `${timestamp} | ${level.toUpperCase()} | ${message}`;
});

const transport = new winston.transports.DailyRotateFile({
    filename: process.env.LOG_FOLDER + process.env.LOG_FILENAME,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '12',
    maxSize: '10m',
    prepend: true,
    level: 'info',
});

transport.on('rotate', function(oldFilename, newFilename) {
    console.log(`Rotated ${oldFilename} with ${newFilename}`);
});

const backendLogger = () => {
    /**
     * To create a logger to log all the activities that are taking place on the backend.
     * Very useful for finding out any bugs or glitches in the system.
     * Also if the server is not slowing down.
     */
    return winston.createLogger({
        level: 'info',
        format: combine(
            timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
            myFormat,
        ),
        transports: [
          transport,
        ],
    });
}

export default backendLogger;