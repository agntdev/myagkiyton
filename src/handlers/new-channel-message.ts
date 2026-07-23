import { Composer } from "grammy";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

// New Channel Message — entry point for processing messages that appear in the
// public channel. When a user posts text or voice in a channel where the bot is
// an admin, this handler triggers the softening workflow. For now it provides a
// landing page; the actual processing happens in process-message.ts.

const composer = new Composer();

const CHANNEL_INFO =
  "When you post text or voice in a public channel where the bot is an admin, " +
  "the message is automatically processed and you receive a private DM with a " +
  "softened draft.\n\n" +
  "Make sure the bot is added as an admin to your channel.";

composer.callbackQuery("menu:new-channel-message", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(CHANNEL_INFO, {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

export default composer;
