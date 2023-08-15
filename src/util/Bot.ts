import { Client, GatewayIntentBits, Interaction, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from "discord.js";
import Logger from "./Logger";
import ModuleManager from "./module/ModuleManager";
import Config from "./Config";
import * as fs from "fs";

export default class Bot {
    client: Client;
    rest: REST;
    logger: Logger;
    moduleManager: ModuleManager;
    config: Config;

    constructor(...intents: GatewayIntentBits[]) {
        this.client = new Client({ intents: intents });
        this.logger = new Logger("Bot");
        this.moduleManager = new ModuleManager(this);
        this.rest = new REST({ version: '10' });

        this.config = this.loadConfig();
        process.env.DEBUG = this.config.debug ? "1" : "0";
    
        this.createBaseEvents();
    }

    private loadConfig(): Config {
        let path = "config.json"
        if(process.env.CONFIG_FILE) {
            path = process.env.CONFIG_FILE
        }

        if(!fs.existsSync(path)) {
            throw new Error(`${path} does not exist`)
        }

        const dataRaw = fs.readFileSync(path).toString();
        const dataJSON = JSON.parse(dataRaw);

        return dataJSON;
    }

    private createBaseEvents() {
        this.client.on("ready", async () => { await this.onReady() });
        this.client.on("interactionCreate", async (i) => { await this.onInteraction(i); });
    }

    private getCommands() {
        let commands: Array<SlashCommandBuilder> = [];
        this.moduleManager.modules.forEach(element => {
            commands.push(element.commandManager.buildCommand());
        });

        return commands;
    }

    private async refreshCommands() {
        if(!this.client.application) {
            throw new TypeError("Client application not loaded");
        }
    
        let commands = this.getCommands();
        let commandData: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [] // Why

        commands.forEach(element => {
            commandData.push(element.toJSON());
        });
        
        await this.rest.put(
            Routes.applicationCommands(this.client.application.id),
            { body: commandData }
        )
    }

    private async onReady() {
        this.logger.info("Initializing modules...")
        await this.moduleManager.loadModules();
        this.logger.info("Modules initialized, registering commands...")
        await this.refreshCommands();
        this.logger.info("Commands registered, ready to use!");
    }

    private async onInteraction(interaction: Interaction) {
        if(interaction.isChatInputCommand()) {
            this.moduleManager.modules.forEach(element => {
                element.commandManager.processCommand(interaction);
            });
        }
    }

    async run(token: string) {
        this.rest.setToken(token);
    
        this.logger.info("Calling log-in function...")
        return await this.client.login(token);
    }
}