const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SUPPORT_SERVER_LINK, BOT_INVITE_LINK } = require("../../../config.json");

module.exports = {
  name: "help",
  description: "Show the help commands menu",
  category: "misc",
  execute(bot, interaction) {
    const cmdDetails = bot.commands.map((c) =>
      `**\/${c.name}**: ${c.description}`
    ).join("\n\n");

    const embed = new MessageEmbed()
      .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
      .setTitle("Help commands")
      .setDescription(`${cmdDetails}`)
      .setColor("BLUE")
      .setTimestamp();

    const supportBtn = new MessageButton()
      .setLabel("Support")
      .setStyle("LINK")
      .setURL(`${SUPPORT_SERVER_LINK}`);

    const inviteBtn = new MessageButton()
      .setLabel("Invite")
      .setStyle("LINK")
      .setURL(`${BOT_INVITE_LINK}`);

    const buttonRow = new MessageActionRow().addComponents([supportBtn, inviteBtn]);

    return interaction.reply({ ephemeral: true, embeds: [embed], components: [buttonRow] });
  }
};