const { MessageEmbed } = require("discord.js");
const throwImageURL = "https://raw.githubusercontent.com/L0SER8228/snowsgiving-bot/main/src/assets/images/throw.png";

module.exports = {
  name: "collect",
  description: "Roll up a shiny new snowball!!",
  category: "snows",
  async execute(bot, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const snowball = 30 * 1000; //30 seconds
    const warmup = 120 * 1000; //120 seconds
    const userId = interaction.user.id;
    const cooldown = bot.cooldowns.get(userId);
    const timeout = bot.timeouts.get(userId);

    if (timeout !== null && warmup - (Date.now() - timeout) > 0) {
      const dateTime = new Date(Date.now() + warmup - (Date.now() - timeout));
      const epoch = (dateTime.getTime() / 1000).toFixed(); //  directly convert to epoch for use in discord markdown

      const errEmbed = new MessageEmbed()
        .setColor("ORANGE")
        .setDescription(`You've been hit by a snowball, please warm up first. (ready <t:${epoch}:R>)`);

      return interaction.editReply({ embeds: [errEmbed] });
    } else if (cooldown !== null && snowball - (Date.now() - cooldown) > 0) {
      // const dateTime = new Date(Date.now() + snowball - (Date.now() - cooldown));

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