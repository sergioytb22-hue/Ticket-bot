const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  customId: 'cancel_close_ticket',
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle('❌ Fermeture annulée')
      .setDescription('La fermeture du ticket a été annulée');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};