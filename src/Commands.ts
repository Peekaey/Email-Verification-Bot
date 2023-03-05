import { Command } from "./Command";
import { Ping } from "./commands/Ping";
import { SendEmail } from "./commands/SendEmail";
import { Verify } from "./commands/Verify";



export const Commands: Command[] = [Ping, SendEmail, Verify]; 
