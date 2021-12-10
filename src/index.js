require("./modules/database");

const DJS = require("discord.js");
const { DISCORD_BOT_TOKEN } = require("../config.json");
const Logger = require("./modules/logger");
const Utils = require("./modules/utils");

const bot = new DJS.Client({
  intents: [
    DJS.Intents.FLAGS.GUILDS
  ],
  partials: [
    DJS.Constants.PartialTypes.GUILD_MEMBER,
    DJS.Constants.PartialTypes.USER
  ]
});

bot.commands = new DJS.Collection();
bot.cooldowns = new Map();
bot.timeouts = new Map();
bot.logger = Logger;
bot.utils = Utils;

require("./handlers/EventHandler")(bot);

bot.login(DISCORD_BOT_TOKEN);

// Unhandled errors
process.on("unhandledRejection", (error) => Utils.sendErrorLog(bot, error, "error"));

process.on("uncaughtExceptionMonitor", (error) => Utils.sendErrorLog(bot, error, "error"));

process.on("warning", (warning) => {
  Utils.sendErrorLog(bot, warning, "warning");
});