const {
  EmbedBuilder,
  ChannelType,
} = require('discord.js');
const config = require('../../config.json');

module.exports = {
  customId: /^(confirm_close_ticket|cancel_close_ticket)$/,
  async execute(interaction) {
    if (interaction.customId === 'confirm_close_ticket') {
      const ticketData = {
        closedBy: interaction.user.tag,
        closedAt: new Date().toLocaleString('fr-FR'),
        channel: interaction.channel.name,
      };

      const embed = new EmbedBuilder()
        .setColor(config.colors.error)
        .setTitle('🔒 Ticket Fermé')
        .setDescription('Ce ticket a été fermé')
        .addFields(
          { name: 'Fermé par', value: ticketData.closedBy, inline: true },
          { name: 'Date', value: ticketData.closedAt, inline: true }
        );

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        await interaction.channel.delete().catch(console.error);
      }, 5000);
    } else if (interaction.customId === 'cancel_close_ticket') {
      const embed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('❌ Fermeture annulée')
        .setDescription('La fermeture du ticket a été annulée');

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
