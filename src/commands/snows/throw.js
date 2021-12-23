const data = require("../../assets/jsons/data.json");
const { MessageEmbed } = require("discord.js");
const hitImageURL = "https://raw.githubusercontent.com/L0SER8228/snowsgiving-bot/main/src/assets/images/hit.png";
const missImageURL = "https://raw.githubusercontent.com/L0SER8228/snowsgiving-bot/main/src/assets/images/miss.png";

module.exports = {
  name: "throw",
  description: "Start a snowball fight with another server member",
  category: "snows",
  options: [{
    type: "USER",
    name: "target",
    description: "Who do you want to throw a snowball at ?",
    required: true
  }],
  async execute(bot, interaction) {
    const db = await bot.utils.getSnowDB(interaction.guildId, interaction.user.id);

    if (!db.available) {
      const errEmbed = new MessageEmbed()
        .setColor("ORANGE")
        .setDescription("Oops! You don’t have any snowballs. Use the /collect command to stock up!");

      return interaction.reply({ ephemeral: true, embeds: [errEmbed] });
    }

    await interaction.deferReply();

    const target = interaction.options.getUser("target", true);

    const result = data[Math.floor(Math.random() * data.length)];

    if (target.id === interaction.user.id || !result.success) {
      await bot.utils.updateSnowDB(interaction.guildId, interaction.user.id, {
        available: db.available - 1,
        misses: db.misses + 1
      });
    }

    if (result.success) {
      await bot.utils.updateSnowDB(interaction.guildId, interaction.user.id, {
        available: db.available - 1,
        hits: db.hits + 1
      });

      await bot.utils.updateSnowDB(interaction.guildId, target.id, {
        kos: db.kos + 1
      });

      bot.timeouts.set(target.id, Date.now());
    }

    let embed = new MessageEmbed();
    if (target.id === interaction.user.id) {
      embed.setColor("RED")
        .setDescription("You can’t throw a snowball at yourself! Unless you like, smush it against your face… so choose a fellow server member!");
    } else {
      embed.setColor(`${result.success ? "GREEN" : "ORANGE"}`)
        .setDescription(`${result.message.replace(/{user}/g, target.toString())}`)
        .setImage(`${result.success ? `${hitImageURL}` : `${missImageURL}`}`);
    }

    return interaction.editReply({ embeds: [embed] });
  }
};
