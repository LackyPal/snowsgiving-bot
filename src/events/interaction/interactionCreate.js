module.exports = {
  name: "interactionCreate",
  async execute(bot, interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.inGuild()) return;

    await bot.application?.commands.fetch(interaction.commandId).catch(() => null);

    try {
      const cmdName = interaction.commandName;
      const command = bot.commands.get(cmdName);

      if (!command) return;
      if (!interaction.commandId) return;

      await command.execute(bot, interaction);
    } catch (err) {
      bot.utils.sendErrorLog(bot, err, "error");
      if (interaction.replied) return;

      if (interaction.deferred) {
        return interaction.editReply({ content: "Something went wrong. Sorry for the inconveniences." });
      } else {
        return interaction.reply({ content: "Something went wrong. Sorry for the inconveniences." });
      }
    }
  }
};