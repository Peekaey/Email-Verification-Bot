import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_TOKEN);
const VerifiedSendor = process.env.VERIFIEDSENDOR;

export const SendEmail: Command = {
  name: "sendemail",
  description: "Enter an email address that the bot can send a verification token to",
  options: [
    {
      name: "message",
      description: "Grab user provided email",
      type: 3,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const email = interaction.options.get("message")!.value as string;
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail: Boolean = emailRegex.test(email);

    
    let response: string = "defaultresponse";
    var emailVerificationToken: string = (+new Date() * Math.random()).toString(36).substring(0, 6);
    let createNew: boolean = true;
    let sendemail: boolean = true;
    const emailBody: string = `Your verification token is ${emailVerificationToken}, please use this token with the /verify command on the discord server `;
    
    // Checks If Email is in valid format 
    if (isValidEmail) {
      let authorEmail = email;

      // Checks if the email already exists in the tempUser database
      async function checkIfEmailExists(email: string): Promise<boolean> {
        const result = await prisma.tempUsers.findUnique({
          where: { email: authorEmail },
          select: { email: true },
        });

        return Boolean(result);
      }

      const emailExists = await checkIfEmailExists("email");

      // If Email already Exists in the tempUser Data
      if (emailExists) {

        // Checks if the user is verified in the temp database
        async function checkIfEmailVerified(
          verifiedemail: String,
          verified: number
        ): Promise<Boolean> {
          const result = await prisma.tempUsers.findFirst({
            where: { email: authorEmail, verified: 1 },
          });

          return Boolean(result);
        }

        const verifiedEmail = await checkIfEmailVerified("verifiedemail", 1);

        // If existing email is found but not verified, will regen and store the new token - then send another email.
        if (!verifiedEmail) {

          const updateUser = await prisma.tempUsers.update({
            where: {
              email: authorEmail,
            },
            data: {
              verificationToken: emailVerificationToken,
            },
          })
          response = "Existing email found but not verified, resent another email and new token";
          createNew = false;
        }

        // If email is already verified, will change response and not regend or send another email.
        if (verifiedEmail) {
          response = "Email is already verified";
          sendemail = false;
        }

      }

      // If email is a valid format and the send email boolean is true (such as not verified or brand new email)
      if ( isValidEmail && sendemail) {
      const msg = {
          to: authorEmail, // Change to your recipient
          from: VerifiedSendor, // Change to your verified sender
          subject: 'Verification token from Discord Server',
          text: emailBody,
        }
        sgMail
          .send(msg)
          .then(() => {
            console.log('Email sent')
          })
          .catch((err: String) => {
            console.error(err, String)
          })

          if (createNew) {
            response = "Email Successfully Sent";
            const addUser = await prisma.tempUsers.create({
              data: {
                email: authorEmail,
                verificationToken: emailVerificationToken,
              }
            })

          }
    } 
    }
    // Returns and advises user to enter a valid email format
    if (!isValidEmail) {
      response = "Email Entered is Not Valid, Please Try Again";
    }

    await interaction.followUp({
      ephemeral: true,
      content: response,
    });
  },
};
