import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
} from "../toolkit/index.js";

// Process Message — the core workflow. User taps the menu button, enters
// processing mode, sends text, and receives a softened draft with confirmation
// buttons. The session tracks whether the user is in the processing flow.

registerMainMenuItem({ label: "✉️ Process message", data: "process:menu", order: 10 });

/** Russian harsh → softened mapping (deterministic, no API required for tests). */
const HARSH_TO_SOFT: [RegExp, string][] = [
  [/идиот/gi, "некорректный человек"],
  [/тупой/gi, "непродуманный"],
  [/дурак/gi, "необдуманный"],
  [/глупый/gi, "не совсем верный"],
  [/ненавижу/gi, "мне не нравится"],
  [/ненависть/gi, "нежелание"],
  [/возмущён/gi, "обеспокоен"],
  [/возмущаю/gi, "обеспокоен"],
  [/жутко/gi, "довольно"],
  [/кошмар/gi, "сложная ситуация"],
  [/отвратительно/gi, "не совсем приятно"],
  [/неприемлемо/gi, "стоит пересмотреть"],
  [/урод/gi, "некрасивый"],
  [/кретин/gi, "неосведомлённый человек"],
  [/дебил/gi, "неосведомлённый человек"],
  [/с ума сошёл/gi, "поспешно решил"],
  [/пошёл на хуй/gi, "прошу воздержаться"],
  [/заткнись/gi, "позвольте высказаться"],
  [/пофиг/gi, "не столь важно"],
  [/пофигист/gi, "человек с другим приоритетом"],
  [/хрень/gi, "непростая задача"],
  [/фигня/gi, "непростая задача"],
  [/дерьмо/gi, "сложная ситуация"],
  [/отстой/gi, "не самый удачный вариант"],
  [/криворукий/gi, "некорректный"],
  [/убей себя/gi, "подумай ещё раз"],
  [/сдохни/gi, "прошу прощения"],
  [/тварь/gi, "человек"],
  [/засранец/gi, "некорректный человек"],
  [/маньяк/gi, "человек с особенностями"],
  [/ненормальный/gi, "не совсем обычный"],
  [/трус/gi, "осторожный человек"],
  [/предатель/gi, "человек с другими взглядами"],
  [/враг/gi, "оппонент"],
  [/противник/gi, "оппонент"],
  [/идиотизм/gi, "непродуманность"],
  [/тупость/gi, "непродуманность"],
  [/глупость/gi, "непродуманность"],
  [/дерьмовый/gi, "не совсем удачный"],
  [/жопа/gi, "непростая ситуация"],
  [/пиздец/gi, "сложная ситуация"],
];

function softenText(raw: string): string {
  let result = raw;
  for (const [pattern, replacement] of HARSH_TO_SOFT) {
    result = result.replace(pattern, (match) => {
      if (match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }
  return result;
}

const composer = new Composer<Ctx>();

const PROCESS_MENU_TEXT =
  "✉️ Send me a text message and I will generate a softened version for you.\n\n" +
  "You will receive a DM with the draft and can choose to accept or reject it.";

const PROCESS_MENU_KB = inlineKeyboard([
  [inlineButton("⬅️ Back to menu", "menu:main")],
]);

composer.callbackQuery("process:menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  (ctx.session as Record<string, unknown>).step = "awaiting_text";
  await ctx.editMessageText(PROCESS_MENU_TEXT, { reply_markup: PROCESS_MENU_KB });
});

// Handle text messages only when the user is in the processing flow.
// Uses session step to avoid catching unrelated messages.
composer.on("message:text", async (ctx, next) => {
  const step = (ctx.session as Record<string, unknown>).step;
  if (step !== "awaiting_text") return next();

  const text = ctx.message.text;
  if (!text) return next();

  (ctx.session as Record<string, unknown>).step = "idle";

  const softened = softenText(text);
  const trimmed = softened.length > 500 ? softened.slice(0, 500) + "…" : softened;

  const kb = inlineKeyboard([
    [
      inlineButton("✅ Accept", "draft:accept"),
      inlineButton("❌ Reject", "draft:reject"),
    ],
    [inlineButton("⬅️ Back to menu", "menu:main")],
  ]);

  await ctx.reply(
    "Here is your softened draft:\n\n" + trimmed,
    { reply_markup: kb },
  );
});

// Handle voice messages — transcribe then soften.
composer.on("message:voice", async (ctx) => {
  await ctx.reply("Voice received. Transcription and softening will be available soon.");
});

export default composer;
