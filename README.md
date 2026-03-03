# 🎧 Study247 Bot — 24/7 Discord Lofi Radio

A self-hosted Discord music bot that streams lofi radio 24/7 and stays connected even if the voice channel is empty.

Built with:

* Node.js
* discord.js
* @discordjs/voice
* Express (for cloud uptime support)

---

## 🚀 Features

* ✅ Automatically joins a specific voice channel
* ✅ Streams continuous radio (never-ending stream)
* ✅ Auto-restarts stream if connection drops
* ✅ Can run 24/7 on Render / Railway
* ✅ Includes Express web server for uptime monitoring
* ✅ No premium, no dependency on public music bots

---

## 📦 Local Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/CodeWithShrey-collab/Study247-bot.git
cd study247bot
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create environment file

Create a `.env` file in the root directory:

```
TOKEN=your_discord_bot_token
VOICE_CHANNEL_ID=your_voice_channel_id
STREAM_URL=https://live.hunter.fm/lofi_high
```

### 4️⃣ Run the bot

```bash
node index.js
```

The bot will:

* Log in
* Join the configured voice channel
* Begin streaming lofi music 24/7

---

## 🌐 Deploying on Render (Recommended)

Create a **Web Service** on Render.

**Build Command:**

```
npm install
```

**Start Command:**

```
node index.js
```

Add the following environment variables in the Render dashboard:

* `TOKEN`
* `VOICE_CHANNEL_ID`
* `STREAM_URL`

After deployment, use an uptime monitoring service (like UptimeRobot) to ping the service URL every 5 minutes to prevent sleep mode.

---

## 🔐 Required Discord Bot Permissions

Voice Permissions:

* Connect
* Speak

Text Permissions (Optional):

* View Channels
* Send Messages
* Read Message History

---
