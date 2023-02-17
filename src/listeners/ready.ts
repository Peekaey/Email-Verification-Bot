import { Client } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        await client.application.commands.set(Commands);
        client.user.setActivity(`with ${client.guilds.cache.size} guild(s)`);
        console.log(`${client.user.username} is online`);
        
    });
}; 