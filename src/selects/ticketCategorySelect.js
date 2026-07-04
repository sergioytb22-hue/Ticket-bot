const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  customId: 'ticket_category_select',
  async execute(interaction) {
    const category = interaction.values[0];
    const categoryData = config.categories.find(c => c.name === category);

    if (!categoryData) {
      return await interaction.reply({
        content: '❌ Catégorie non trouvée!',
        ephemeral: true,
      });
    }

    try {
      // Afficher un modal pour demander le sujet du ticket
      const modal = new ModalBuilder()
        .setCustomId(`ticket_modal_${category}`)
        .setTitle(`Créer un ticket - ${categoryData.label}`);

      const subjectInput = new TextInputBuilder()
        .setCustomId('ticket_subject')
        .setLabel('Sujet du ticket')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100);

      const descriptionInput = new TextInputBuilder()
        .setCustomId('ticket_description')
        .setLabel('Description du problème')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

      const firstRow = new ActionRowBuilder().addComponents(subjectInput);
      const secondRow = new ActionRowBuilder().addComponents(descriptionInput);

      modal.addComponents(firstRow, secondRow);

      await interaction.showModal(modal);
    } catch (error) {
      console.error('Erreur lors du traitement du menu déroulant:', error);
      await interaction.reply({
        content: '❌ Erreur lors du traitement de votre sélection!',
        ephemeral: true,
      }).catch(() => {});
    }
  },
};
