import { Command } from "./Command";
import { Ping } from "./commands/Ping";
import { SendEmail } from "./commands/SendEmail";
import { Verify } from "./commands/Verify";


//Commands Array: Add new commands by importing the command from the files in the commands folder then add to below array
export const Commands: Command[] = [Ping, SendEmail, Verify]; 
