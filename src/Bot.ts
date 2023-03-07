
const dotenv = require("dotenv").config();
import { Client, ClientOptions, GatewayIntentBits } from "discord.js";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";

const token = process.env.DISCORD_TOKEN; // add your token here

console.log("Bot is starting...");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences]
});

ready(client);
interactionCreate(client);

client.login(token); 