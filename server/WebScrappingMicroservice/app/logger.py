from loguru import logger

def customLogger(level, message):
    logger.add('log_file-{time:YYYY-MM-DD}.log', format='{time} | {level} | {message}', level='INFO', rotation='12 days', compression='zip')
    if level == 'info':
        logger.info(message)
    else:
        logger.error(message)