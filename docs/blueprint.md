# Softened Message Converter — Bot specification

**Archetype:** workflow

**Voice:** professional and warm — write every user-facing message, button label, error, and empty state in this voice.

A Telegram bot that transforms harsh Russian messages into delicate versions, sends private confirmation to authors, and optionally reposts to a public channel with explicit approval.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- Telegram users in Russian-speaking communities
- Content creators seeking tone refinement

## Success criteria

- Users receive private DMs with softened drafts within 5 seconds of submission
- 95% confirmation button click-through rate for accepted drafts
- Zero auto-posted content without explicit user confirmation

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open main menu with bot instructions and usage examples
- **New channel message** (button, actor: telegram) — Trigger processing workflow when user posts text/voice in public channel

## Flows

### Message submission workflow
_Trigger:_ New message in public channel

1. Detect submission (text/voice)
2. Transcribe voice to text if needed
3. Generate softened Russian draft
4. Send private DM with draft + confirmation buttons
5. Process user confirmation choice

_Data touched:_ Submission, Draft, Confirmation

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **Submission** _(retention: persistent)_ — Original user message content (text or transcribed voice)
  - fields: raw_content, message_type, timestamp
- **Draft** _(retention: persistent)_ — Bot-generated softened Russian version
  - fields: original_excerpt, softened_text, modification_history
- **Confirmation** _(retention: persistent)_ — User's choice to accept/edit/reject
  - fields: action_type, timestamp, final_version

## Integrations

- **Telegram** (required) — Public channel messaging and private DMs
- **Voice-to-text** (required) — Automatic Russian transcription of voice messages
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Manage public channel access
- Configure retention period (default 90 days)
- View audit logs of submissions and confirmations

## Notifications

- Private DM with softened draft and confirmation buttons
- Optional one-tap repost button after acceptance

## Permissions & privacy

- Store submissions and drafts for 90 days
- Only message authors receive DM notifications
- No auto-deletion or moderation of public content

## Edge cases

- Users without Telegram private message permissions
- Voice messages with poor transcription quality
- Users rejecting multiple drafts in sequence

## Required tests

- End-to-end test: voice message submission → transcription → DM confirmation → accepted and reposted
- Boundary test: 500-character text submission → softened draft under 200 characters
- Privacy test: verify no unconfirmed content appears in public channel

## Assumptions

- Users expect Russian-only processing
- Softened drafts maintain original intent while reducing harshness
- Default 90-day retention is acceptable for most users
