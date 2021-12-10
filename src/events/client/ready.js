module.exports = {
  name: "ready",
  once: true,
   execute(bot) {
    //initializing commands
    require("../../handlers/CommandHandler")(bot);

    const data = `${bot.user.tag} is running with ${bot.guilds.cache.size} servers.`;

    bot.logger.info("BOT_READY", data);

      bot.user.setActivity("\/help", { type: "LISTENING" });
  }
};