const { SUPPORT_SERVER_LINK } = require("../../../config.json");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "support",
  description: "Join the discord support server and get some help",
  category: "misc",
  execute(bot, interaction) {
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`[Click to join the support server.](${SUPPORT_SERVER_LINK})`);

    const buttonRow = new MessageActionRow().addComponents([
      new MessageButton()
      .setLabel("Server Link")
      .setStyle("LINK")
      .setURL(`${SUPPORT_SERVER_LINK}`)
    ]);

    return interaction.reply({ ephemeral: true, embeds: [embed], components: [buttonRow] });
  }
};