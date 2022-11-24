import backendLogger from "./backendLogger.js";

let logger = null;

if (process.env.NODE_ENV !== 'production') {
  logger = backendLogger();
}

export default logger;