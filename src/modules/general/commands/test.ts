import { ChatInputCommandInteraction, CacheType } from "discord.js";
import Command from "../../../util/module/Command";

export default class TestCommand extends Command {
    name = "test";
    description = "test command";

    async onExecute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.reply("hi");
    }
}