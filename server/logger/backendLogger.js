import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${level}] ${timestamp} : ${message}`;
});

const backendLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(
            timestamp({format: "HH:mm:ss"}),
            myFormat,
        ),
        transports: [
          //
          // - Write all logs with importance level of `error` or less to `error.log`
          // - Write all logs with importance level of `info` or less to `combined.log`
          //
          new transports.File({ name: "error", filename: './logs/error.log', level: 'error' }),
          new transports.File({ name: "info", filename: './logs/info.log', level: 'info' }),
        ],
    });
}

export default backendLogger;