import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import * as fs from 'fs';
import Bot from "./util/Bot";

if(fs.existsSync(".env")) {
    dotenv.config();
}

export const config = JSON.parse(fs.readFileSync("config.json").toString());
const bot = new Bot(GatewayIntentBits.Guilds);

let token = process.env.DISCORD_TOKEN
if(!token) {
    bot.logger.error(".env.TOKEN does not exist!");
    process.exit(1);
}

bot.run(token);