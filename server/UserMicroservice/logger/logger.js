import backendLogger from "./backendLogger.js";

let logger = null;

/**
 * If the environment is not production then use backendLogger as logger.
 */
if (process.env.NODE_ENV !== 'production') {
  logger = backendLogger();
}

export default logger;