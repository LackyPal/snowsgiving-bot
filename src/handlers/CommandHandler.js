const glob = require("glob");

module.exports = async function loadCommands(bot) {
  const commandFiles = glob.sync("./src/commands/**/*.js");

  for (const file of commandFiles) {
    const command = require(`../../${file}`);

    if (!command.name) {
      throw new TypeError(`[ERROR][COMMANDS]: name is required for commands! (${file})`);
    }

    if (!command.execute) {
      throw new TypeError(
        `[ERROR][COMMANDS]: execute function is required for commands! (${file})`
      );
    }

    const data = {
      type: "CHAT_INPUT",
      name: command.name,
      description: command.description ?? "Empty description",
      options: command.options ?? []
    };

    //registering slash command
    await bot.application?.commands.create(data);

    delete require.cache[require.resolve(`../../${file}`)];

    bot.commands.set(command.name, command);

    //debug
    //bot.logger.debug("COMMANDS", `Loaded: ${command.name}`);
  }
};
