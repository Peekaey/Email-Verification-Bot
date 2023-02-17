import { CommandInteraction, Client} from "discord.js";
import { Command } from "../Command";

export const Ping: Command = {
    name: "ping",
    description: "Sample Text",
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = "Fake Ping Content";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 


