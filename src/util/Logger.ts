import ANSIColor from "./ANSIColor";
export default class Logger {
    name: string = "";

    constructor(name: string) {
        this.name = name;
    }

    createPrefix(level: string, color: string) {
        const now = new Date();
        const prefix = `${now} ${this.name} [${level}]`;
        return `${color}${prefix}${ANSIColor.RESET}`
    }

    info(...msg: any[]) {
        const prefix = this.createPrefix("INFO", ANSIColor.BOLD + ANSIColor.WHITE)
        return console.log(`${prefix} ${msg.join(" ")}`);
    }

    warn(...msg: any[]) {
        const prefix = this.createPrefix("INFO", ANSIColor.BOLD + ANSIColor.YELLOW)
        return console.warn(`${prefix} ${msg.join(" ")}`);
    }

    error(...msg: any[]) {
        const prefix = this.createPrefix("ERROR", ANSIColor.BOLD + ANSIColor.RED)
        return console.error(`${prefix} ${msg.join(" ")}`);
    }
    
    debug(...msg: any[]) {
        if(process.env.DEBUG != "1") return;
        const prefix = this.createPrefix("DEBUG", ANSIColor.BOLD + ANSIColor.MAGENTA)
        return console.error(`${prefix} ${msg.join(" ")}`);
    }
}