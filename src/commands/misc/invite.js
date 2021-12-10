const { BOT_INVITE_LINK } = require("../../../config.json");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite the bot to your server",
  category: "misc",
  execute(bot, interaction) {
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`[Click to invite me to your server.](${BOT_INVITE_LINK})`);

    const buttonRow = new MessageActionRow().addComponents([
      new MessageButton()
      .setLabel("Invite Link")
      .setStyle("LINK")
      .setURL(`${BOT_INVITE_LINK}`)
    ]);

    return interaction.reply({ ephemeral: true, embeds: [embed], components: [buttonRow] });
  }
};