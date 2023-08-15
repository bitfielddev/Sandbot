import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import Module from ".";
import Bot from "../Bot";

export default class Command {
    name: string = "";
    description: string = this.name;
    module: Module | undefined = undefined;
    bot: Bot | undefined = undefined;

    async init(bot: Bot, module: Module) {
        this.bot = bot;
        this.module = module;

        return await this.onReady();
    }

    async onReady() { }

    modifyBuilder(builder: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
        return builder;
    }

    createBuilder(): SlashCommandSubcommandBuilder {
        if(!this.name || !this.description) {
            throw new TypeError("Name and description must be valid");
        }

        let builder = new SlashCommandSubcommandBuilder()
            .setName(this.name.toLowerCase())
            .setDescription(this.description);

        builder = this.modifyBuilder(builder); // For the user to add options and modify the builder

        return builder;
    }

    async onExecute(interaction: ChatInputCommandInteraction) { }
}