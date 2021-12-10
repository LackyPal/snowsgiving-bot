const SnowModel = require("../../models/Snow.model");
const places = require("../../assets/jsons/places.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "leaderboard",
  description: "See who's dominating the Snowsgiving Bot leaderboard in your server.",
  category: "snows",
  async execute(bot, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const db = await SnowModel.find({ guild_id: interaction.guildId });

    const data = db.sort((a, b) => b.hits - a.hits)
      .splice(0, 10);

    const embed = new MessageEmbed()
      .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL())
      .setTitle("Snowball Champions")
      .setDescription("\( Hits \/ Misses \/ KOs \)")
      .setColor("BLUE");

    data.forEach(async (item, idx) => {
      let user = bot.users.cache.get(item.user_id) || (await bot.users.fetch(item.user_id));

      embed.addField(`${places[idx]} ${user.tag}`,
        `\( ${item.hits} \/ ${item.misses} \/ ${item.kos} \)`);
    });

    return interaction.editReply({ embeds: [embed] });
  }
};
