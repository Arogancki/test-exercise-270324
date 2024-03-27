import pino from "pino";
import env from "../../configs/env";

export default function loggerFactory() {
    return pino({
        enabled: env.NODE_ENV !== 'test'
    });
}
