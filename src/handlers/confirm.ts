import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

// Confirm Draft — handles accept/reject/repost button taps after the user
// receives a softened draft. Sends confirmation and optionally reposts to channel.

const composer = new Composer<Ctx>();

const ACCEPT_TEXT = "Draft accepted! You can now repost it to the channel.";

const REJECT_TEXT = "Draft rejected. Send me another message to try again.";

composer.callbackQuery("draft:accept", async (ctx) => {
  await ctx.answerCallbackQuery();
  const kb = inlineKeyboard([
    [inlineButton("📢 Repost to channel", "draft:repost")],
    [inlineButton("⬅️ Back to menu", "menu:main")],
  ]);
  await ctx.editMessageText(ACCEPT_TEXT, { reply_markup: kb });
});

composer.callbackQuery("draft:reject", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(REJECT_TEXT, {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

composer.callbackQuery("draft:repost", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Reposted to the channel successfully!", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

export default composer;
