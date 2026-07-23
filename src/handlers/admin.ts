import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
} from "../toolkit/index.js";

// Admin Controls — owner-only panel for managing the bot's channel access,
// retention settings, and audit logs. Uses callback queries for navigation.

registerMainMenuItem({ label: "⚙️ Admin", data: "admin:menu", order: 50 });

const composer = new Composer<Ctx>();

const ADMIN_TEXT =
  "⚙️ Admin panel\n\n" +
  "Manage your bot settings from here.";

const ADMIN_KB = inlineKeyboard([
  [inlineButton("📡 Channel access", "admin:channel"), inlineButton("🗓 Retention", "admin:retention")],
  [inlineButton("📋 Audit logs", "admin:audit")],
  [inlineButton("⬅️ Back to menu", "menu:main")],
]);

composer.callbackQuery("admin:menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(ADMIN_TEXT, { reply_markup: ADMIN_KB });
});

composer.callbackQuery("admin:channel", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    "📡 Channel access\n\n" +
      "Configure which channel the bot monitors for messages.\n" +
      "Current: not configured.\n\n" +
      "Add the bot as an admin to your channel to get started.",
    {
      reply_markup: inlineKeyboard([
        [inlineButton("⬅️ Back", "admin:menu")],
      ]),
    },
  );
});

composer.callbackQuery("admin:retention", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    "🗓 Retention\n\n" +
      "Submissions and drafts are kept for 90 days by default.\n" +
      "You can change this in the bot's configuration.",
    {
      reply_markup: inlineKeyboard([
        [inlineButton("⬅️ Back", "admin:menu")],
      ]),
    },
  );
});

composer.callbackQuery("admin:audit", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    "📋 Audit logs\n\n" +
      "No submissions yet. Once users start processing messages, " +
      "their activity will appear here.",
    {
      reply_markup: inlineKeyboard([
        [inlineButton("⬅️ Back", "admin:menu")],
      ]),
    },
  );
});

export default composer;
