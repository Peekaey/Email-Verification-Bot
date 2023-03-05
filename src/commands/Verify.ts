import { CommandInteraction, Client} from "discord.js";
import { Command } from "../Command";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Verify: Command = {
    name: "verify",
    description: "Verify the user",
    options: [{
        name: "message",
        description: "Grab user provided token",
        type: 3,
        required: true
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const userProvidedToken = interaction.options.get("message")!.value as string;
        let response = 'defaultresponse';
        let tokenMatch: Boolean = false;

      // Checks if the user already exists in the tempUser database
      async function checkIfEmailExists(vericationToken: string): Promise<boolean> {
        const result = await prisma.tempUsers.findFirst({
          where: { verificationToken: userProvidedToken },
          select: { email: true },
        });

        return Boolean(result);
      }

      const TokenMatch = await checkIfEmailExists("VerificationToken");

      // Runs if User Exists in the Temp Base and Token Matches
      if (TokenMatch) {

        // Grabs email from Temp Database
        async function GrabUserEmail(): Promise<string> {
          const userEmail = await prisma.tempUsers.findFirst({
            where: { verificationToken: userProvidedToken },
            select: { email: true },
          });
  
          return userEmail?.email ?? '';
        }

        // Grabbing message author information
        let authorId = interaction.user.id
        let authorUsername = interaction.user.tag;
        let email = await GrabUserEmail();

      // Attempts to see if email from tempUsers matches any emails in verifiedUsers
      async function checkIfEmailExists(email: string): Promise<boolean> {
        const result = await prisma.verifiedUsers.findFirst({
          where: { email: email },
          select: { email: true },
        });

        return Boolean(result);
      }

      const emailExists = await checkIfEmailExists(email);
      
      // If email in tempUser doesn't match any in verifiedUser - add new entry
      if (!emailExists) {

        const addUser = await prisma.verifiedUsers.create({
            data: {
              user_id: authorId,
              discordId: authorUsername ,
              email: email,
              created_at: new Date(),
            },
          });

          const addVerifiedStatus = await prisma.tempUsers.update({
            where: {
              email: email,
            },
            data: {
              verified: 1,
            },
          })

            response = "Tokens Match, You have been verified and the {ROLE} has been assigned to you";

      // If email already exists in verifiedUsers - does no action
      } else if (emailExists) {
            response = "Email using this token has already been verified"
      }
    }
      // Response to if the provided token is unable to find a match
      if (!TokenMatch) {
        response = "Provided token does not match any in the system, please recheck your email and try again";
      }

        await interaction.followUp({
            ephemeral: true,
            content:response
        });
    }
}; 
