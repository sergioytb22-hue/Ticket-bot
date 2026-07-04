const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  customId: 'confirm_close_ticket',
  async execute(interaction) {
    // Vérifier les permissions
    if (!interaction.member.permissions.has('ManageMessages')) {
      return await interaction.reply({
        content: '❌ Vous n\'avez pas la permission de fermer ce ticket !',
        ephemeral: true,
      });
    }

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
  },
};
