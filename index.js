const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive 24/7");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server running.");
});

require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;
const STREAM_URL = process.env.STREAM_URL;

function startRadio(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  const player = createAudioPlayer();

  const playStream = () => {
    const resource = createAudioResource(STREAM_URL);
    player.play(resource);
  };

  // If stream drops, restart it
  player.on(AudioPlayerStatus.Idle, () => playStream());
  player.on("error", () => playStream());

  playStream();
  connection.subscribe(player);

  console.log("✅ Joined VC and started 24/7 stream.");
}

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
  if (!channel) return console.log("❌ Voice channel not found.");

  startRadio(channel);
});

client.login(process.env.TOKEN);