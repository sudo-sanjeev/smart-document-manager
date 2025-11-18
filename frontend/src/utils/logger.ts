export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

interface LoggerConfig {
  level: LogLevel;
  enableTimestamp: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level ?? (import.meta.env.MODE === 'production' ? LogLevel.WARN : LogLevel.DEBUG),
      enableTimestamp: config.enableTimestamp ?? true,
    };
  }

  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  private formatMessage(level: string, message: string): string {
    const parts: string[] = [];

    if (this.config.enableTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    parts.push(`[${level}]`);
    parts.push(message);

    return parts.join(' ');
  }

  private log(level: LogLevel, levelName: string, message: string): void {
    if (level < this.config.level) return;

    const formattedMessage = this.formatMessage(levelName, message);

    if (level === LogLevel.WARN) {
      console.warn(formattedMessage);
    } else if (level === LogLevel.ERROR) {
      console.error(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message);
  }

  info(message: string): void {
    this.log(LogLevel.INFO, 'INFO', message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, 'WARN', message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, 'ERROR', message);
  }
}

const logger = new Logger();

export default logger;

export const debug = logger.debug.bind(logger);
export const info = logger.info.bind(logger);
export const warn = logger.warn.bind(logger);
export const error = logger.error.bind(logger);

