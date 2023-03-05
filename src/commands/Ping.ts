import { CommandInteraction, Client} from "discord.js";
import { Command } from "../Command";

export const Ping: Command = {
    name: "ping",
    description: "Get the current ping of the bot",
    run: async (client: Client, interaction: CommandInteraction) => {
        const ping = Date.now() - interaction.createdTimestamp;
        const content = `Pong! Latency: ${ping}ms`;
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 


