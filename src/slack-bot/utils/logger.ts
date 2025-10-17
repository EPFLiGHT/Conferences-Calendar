/**
 * Structured logging utility for Slack bot
 * Logs are output as JSON for Vercel logging system
 */

export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(
      JSON.stringify({
        level: 'INFO',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },

  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(
      JSON.stringify({
        level: 'WARN',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },

  error: (message: string, error?: any, meta?: Record<string, any>) => {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        message,
        error: error?.message || String(error),
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },

  debug: (message: string, meta?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        JSON.stringify({
          level: 'DEBUG',
          message,
          timestamp: new Date().toISOString(),
          ...meta,
        })
      );
    }
  },
};
