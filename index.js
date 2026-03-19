const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("REJECTION:", err);
});

const express = require("express");
const app = express();

const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");

// =======================
// 🔍 ENV CHECK
// =======================

console.log("ENV CHECK:");
console.log("TOKEN:", process.env.TOKEN ? "Loaded" : "Missing");
console.log("VOICE_CHANNEL_ID:", process.env.VOICE_CHANNEL_ID);
console.log("STREAM_URL:", process.env.STREAM_URL);

// =======================
// 🌐 EXPRESS SERVER
// =======================

app.get("/", (req, res) => {
  res.send("Bot is alive 24/7");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Web server running.");
});

// =======================
// 🤖 DISCORD SETUP
// =======================

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;
const STREAM_URL = process.env.STREAM_URL;

let connection;
let player;

// =======================
// 🎵 RADIO FUNCTION
// =======================

async function startRadio(channel) {
  try {
    console.log("🔊 Joining voice channel...");

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    player = createAudioPlayer();

    const playStream = () => {
      console.log("🎶 Starting stream...");
      const resource = createAudioResource(STREAM_URL);
      player.play(resource);
    };

    player.on(AudioPlayerStatus.Idle, () => {
      console.log("⚠ Stream idle — restarting...");
      playStream();
    });

    player.on("error", (err) => {
      console.log("❌ Player error — restarting...", err.message);
      playStream();
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      console.log("⚠ Voice disconnected. Attempting reconnect...");
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
        console.log("🔄 Reconnected.");
      } catch {
        console.log("❌ Reconnect failed. Destroying...");
        connection.destroy();
      }
    });

    playStream();
    connection.subscribe(player);

    console.log("✅ 24/7 Radio Active.");
  } catch (error) {
    console.log("❌ Failed to start radio:", error);
  }
}

// =======================
// 🚀 BOT READY
// =======================

client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
  if (!channel) return console.log("❌ Voice channel not found.");

  // 🔥 DELAYED START (VERY IMPORTANT)
  setTimeout(() => {
    startRadio(channel);
  }, 5000);

  // 🔁 AUTO-REJOIN LOOP
  setInterval(async () => {
    try {
      const refreshedChannel = await client.channels.fetch(VOICE_CHANNEL_ID);
      if (!refreshedChannel) return;

      const botMember = refreshedChannel.guild.members.me;

      if (!botMember || botMember.voice.channelId !== VOICE_CHANNEL_ID) {
        console.log("🔁 Bot not in VC. Rejoining...");
        startRadio(refreshedChannel);
      }
    } catch (err) {
      console.log("Rejoin check error:", err.message);
    }
  }, 15000);
});

// =======================
// 🔐 LOGIN
// =======================

console.log("🚀 Attempting login...");

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login request sent"))
  .catch((err) => console.error("❌ LOGIN ERROR:", err));
