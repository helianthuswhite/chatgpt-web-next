import winston from "winston";

const { combine, colorize, printf, timestamp } = winston.format;

const logger = winston.createLogger({
    level: "info",
    format: combine(
        colorize(),
        timestamp(),
        printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

const levels = Object.keys(winston.config.syslog.levels);

levels.forEach((level) => {
    // @ts-ignore
    logger[level] = (...props) => {
        let label = "unknown";

        if (props.length > 1) {
            label = props[0];
            props = props.slice(1);
        }

        const messages = [...props].map((prop) =>
            typeof prop === "object" ? JSON.stringify(prop) : prop
        );
        logger.log({ level, label, message: messages.join(" ") });
    };
});

export default logger;
