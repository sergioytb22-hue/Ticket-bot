const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  customId: 'add_user_ticket',
  async execute(interaction) {
    // Vérifier les permissions
    if (!interaction.member.permissions.has('ManageMessages')) {
      return await interaction.reply({
        content: '❌ Vous n\'avez pas la permission d\'ajouter des utilisateurs !',
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId('add_user_modal')
      .setTitle('Ajouter un utilisateur au ticket');

    const userIdInput = new TextInputBuilder()
      .setCustomId('user_id_input')
      .setLabel('ID utilisateur')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('Entrez l\'ID Discord de l\'utilisateur');

    const row = new ActionRowBuilder().addComponents(userIdInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  },
};