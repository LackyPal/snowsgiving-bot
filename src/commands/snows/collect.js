const { MessageEmbed } = require("discord.js");
const throwImageURL = "https://raw.githubusercontent.com/L0SER8228/snowsgiving-bot/main/src/assets/images/throw.png";

module.exports = {
  name: "collect",
  description: "Roll up a shiny new snowball!!",
  category: "snows",
  async execute(bot, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const timeout = 30 * 1000; //30 seconds
    const userId = interaction.user.id;
    const cooldown = bot.cooldowns.get(userId);

    if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
      // const dateTime = new Date(Date.now() + timeout - (Date.now() - cooldown));

      const errEmbed = new MessageEmbed()
        .setColor("ORANGE")
        .setDescription(`You already scooped up all the snow! Let it fall for about 30 seconds, then you’ll be able to make another snowball.`);

      return interaction.editReply({ embeds: [errEmbed] });
    };

    const db = await bot.utils.getSnowDB(interaction.guildId, userId);

    const updatedAvailable = db.available + 1;

    await bot.utils.updateSnowDB(interaction.guildId, interaction.user.id, {
      available: updatedAvailable
    });

    bot.cooldowns.set(userId, Date.now());

    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`Slapping on your warmest pair of gloves, you gathered some snow and started shaping some snowballs. You now have **${updatedAvailable}** of them—let \‘em fly!`)
      .setImage(`${throwImageURL}`);

    return interaction.editReply({ embeds: [embed] });
  }
};