const { MessageEmbed } = require("discord.js");
const SnowModel = require("../../models/Snow.model");

module.exports = {
  name: "stats",
  description: "See who's the best at shooting snow spheres",
  category: "snows",
  options: [{
    type: "USER",
    name: "target",
    description: "Lookup a particular Snowball Sparrer’s stats.",
    required: false
  }],
  async execute(bot, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("target") ?? interaction.user;

    const data = (await SnowModel.find({ guild_id: interaction.guildId }))
      .sort((a, b) => b.hits - a.hits);

    const db = await bot.utils.getSnowDB(interaction.guildId, user.id);

    const totalSnowballs = db.hits + db.misses + db.available;

    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor(`${user.tag}`)
      .setTitle("Player Statistics")
      .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
      //  .addField("Current Rank", `${data.indexOf(db) + 1}`)
      .addField("Direct Hits", `${db.hits}`)
      .addField("Total Misses", `${db.misses}`)
      .addField("KOs", `${db.kos}`)
      .addField("Available Snowballs", `${db.available}`)
      .addField("Total Snowballs Collected", `${totalSnowballs}`);

    return interaction.editReply({ embeds: [embed] });
  }
};