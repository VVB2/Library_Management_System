import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

/**
 * To store the log in a well formated and documented manner.
 */
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} | ${level.toUpperCase()} | ${message}`;
});

/**
 * To create a logger to log all the activities that are taking place on the backend.
 * Very useful for finding out any bugs or glitches in the system.
 * Also if the server is not slowing down.
 */
const backendLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(
            timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
            myFormat,
        ),
        transports: [
          /**
          * - Write all logs with importance level of `info` or less to `combined.log`
          */
          new transports.File({ name: "info", filename: './logs/combined.log', level: 'info' }),
        ],
    });
}

export default backendLogger;