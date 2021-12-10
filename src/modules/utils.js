const SnowModel = require("../models/Snow.model");
const logger = require("./logger");

/**
 * Get data from database
 * @param {string} guildId
 * @param {string} userId
 * @returns {object}
 */
async function getSnowDB(guildId, userId) {
  try {
    let db = await SnowModel.findOne({ guild_id: guildId, user_id: userId });

    if (!db) {
      db = await addSnowDB(guildId, userId);
    }

    return db;
  } catch (error) {
    logger.error("GET_SNOW_DB", error);
  }
}

/**
 * Add guild member to database
 * @param {string} guildId
 * @param {string} userId
 */
async function addSnowDB(guildId, userId) {
  try {
    const db = new SnowModel({ guild_id: guildId, user_id: userId });

    await db.save();

    return db;
  } catch (error) {
    logger.error("ADD_SNOW_DB", error);
  }
}

/**
 * Update guild database
 * @param {string} guildId
 * @param {string} userId
 * @param {object} data
 */
async function updateSnowDB(guildId, userId, data) {
  try {
    if (typeof data !== "object") {
      throw Error("'data' must be an object (updateGuild)");
    }

    // check if guild exists
    await getSnowDB(guildId, userId);

    await SnowModel.findOneAndUpdate({ guild_id: guildId, user_id: userId }, data);
  } catch (error) {
    logger.error("UPDATE_SNOW_DB", error);
  }
}

/**
 * Remove a guild from database
 * @param {string} guildId
 * @param {string} userId
 */
async function removeSnowDB(guildId, userId) {
  try {
    await SnowModel.findOneAndDelete({ guild_id: guildId, user_id: userId });
  } catch (error) {
    logger.error("REMOVE_SNOW_DB", error);
  }
}

const DJS = require("discord.js");

/**
 * Logs error through discord channel
 * @param {DJS.Client} bot
 * @param {DJS.DiscordAPIError|DJS.HTTPError|Error} error
 * @param {"warning"|"error"} type
 */
async function sendErrorLog(bot, error, type) {
  try {
    const errMsg = error.message;
    if (
      errMsg?.includes("Missing Access") ||
      errMsg?.includes("Missing Permissions") ||
      errMsg?.includes("Unknown Message") ||
      errMsg?.includes("Unknown interaction")
    ) {
      return logger.error("ERR_LOG", error);
    }

    if (
      error.stack?.includes("TypeError: Cannot read properties of undefined (reading 'messages')")
    ) {
      return logger.error("ERR_LOG", error);
    }

    const { LOGS_CHANNEL_ID } = require("../../config.json");
    if (!LOGS_CHANNEL_ID) {
      return logger.error("ERR_LOG", error);
    }

    const logChannel = bot.channels.cache.get(LOGS_CHANNEL_ID) ||
      (await bot.channels.fetch(LOGS_CHANNEL_ID));

    if (!logChannel) {
      return logger.error("ERR_LOG", error);
    }

    const code = "code" in error ? error.code : "N/A";
    const httpStatus = "httpStatus" in error ? error.httpStatus : "N/A";
    const requestData = "requestData" in error ? error.requestData : { json: {} };

    const name = error.name || "N/A";
    let stack = error.stack || error;
    let jsonString = "";

    try {
      jsonString = JSON.stringify(requestData.json, null, 2);
    } catch {
      jsonString = "";
    }

    if (jsonString?.length > 1024) {
      jsonString = jsonString ? `${jsonString.substr(0, 1020)}...` : "";
    }

    if (typeof stack === "string" && stack.length > 4096) {
      console.error(stack);
      stack = "An error occurred but was too long to send to Discord, check your console.";
    }

    const { codeBlock } = require("@discordjs/builders");

    const embed = new DJS.MessageEmbed()
      .setTitle("An error occurred")
      .addField("Name", name, true)
      .addField("Code", code.toString(), true)
      .addField("httpStatus", httpStatus.toString(), true)
      .addField("Timestamp", bot.logger.now, true)
      .addField("Request data", codeBlock(jsonString))
      .setDescription(codeBlock(`${stack}`))
      .setColor(type === "error" ? "RED" : "ORANGE")
      .setFooter(`${bot.user.tag}`, bot.user.displayAvatarURL());

    await logChannel.send({ embeds: [embed] });
  } catch (e) {
    console.error({ error });
    console.error(e);
  }
}

module.exports = {
  addSnowDB,
  getSnowDB,
  updateSnowDB,
  removeSnowDB,
  sendErrorLog
};
