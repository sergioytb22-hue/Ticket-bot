const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  customId: 'create_panel_modal',
  async execute(interaction) {
    const panelMessage = interaction.fields.getTextInputValue('panel_message');
    const channelId = interaction.fields.getTextInputValue('panel_channel');
    const config = require('../../config.json');
    const { EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');

    try {
      let targetChannel;
      if (channelId) {
        targetChannel = await interaction.guild.channels.fetch(channelId);
        if (!targetChannel) {
          return await interaction.reply({
            content: '❌ Salon non trouvé!',
            ephemeral: true,
          });
        }
      } else {
        targetChannel = interaction.channel;
      }

      const embed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTitle('🎫 Système de Tickets')
        .setDescription(panelMessage)
        .addFields(...config.categories.map(cat => ({
          name: `${cat.emoji} ${cat.label}`,
          value: `Crée un ticket ${cat.label.toLowerCase()}`,
          inline: true,
        })))
        .setFooter({ text: 'Utilisez le menu déroulant pour sélectionner une catégorie' });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('ticket_category_select')
        .setPlaceholder('Choisir une catégorie...')
        .addOptions(config.categories.map(cat => ({
          label: cat.label,
          value: cat.name,
          emoji: cat.emoji,
          description: `Créer un ticket ${cat.label.toLowerCase()}`
        })));

      const { ActionRowBuilder } = require('discord.js');
      const row = new ActionRowBuilder().addComponents(selectMenu);
      
      await targetChannel.send({ embeds: [embed], components: [row] });
      
      await interaction.reply({
        content: `✅ Panneau créé avec succès dans ${targetChannel}!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erreur lors de la création du panneau:', error);
      await interaction.reply({
        content: '❌ Erreur lors de la création du panneau!',
        ephemeral: true,
      });
    }
  },
};