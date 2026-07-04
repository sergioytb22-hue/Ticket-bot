const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  customId: /^ticket_modal_.+$/,
  async execute(interaction) {
    const category = interaction.customId.split('_')[2];
    const categoryData = config.categories.find(c => c.name === category);
    const subject = interaction.fields.getTextInputValue('ticket_subject');
    const description = interaction.fields.getTextInputValue('ticket_description');

    if (!categoryData) {
      return await interaction.reply({
        content: '❌ Catégorie non trouvée!',
        ephemeral: true,
      });
    }

    try {
      const ticketNumber = Math.floor(Math.random() * 10000);
      const channelName = `ticket-${category}-${ticketNumber}`;

      // Créer le canal du ticket
      const ticketChannel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        topic: `Ticket #${ticketNumber} | ${categoryData.label} | Créé par ${interaction.user.username}`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ['ViewChannel'],
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
        ],
      });

      // Message d'accueil du ticket
      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle(`${categoryData.emoji} Nouveau Ticket - ${subject}`)
        .setDescription(description)
        .addFields(
          { name: '📌 Catégorie', value: categoryData.label, inline: true },
          { name: '🔢 Numéro', value: `#${ticketNumber}`, inline: true },
          { name: '👤 Auteur', value: interaction.user.username, inline: true },
          {
            name: '⏰ Créé le',
            value: `<t:${Math.floor(Date.now() / 1000)}:f>`,
            inline: false,
          }
        )
        .setFooter({ text: `ID du canal: ${ticketChannel.id}` });

      const closeButton = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Fermer le ticket')
            .setEmoji('🔒')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('add_user_ticket')
            .setLabel('Ajouter un utilisateur')
            .setEmoji('➕')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('remove_user_ticket')
            .setLabel('Retirer un utilisateur')
            .setEmoji('➖')
            .setStyle(ButtonStyle.Secondary)
        );

      await ticketChannel.send({
        embeds: [embed],
        components: [closeButton],
      });

      // Réponse à l'utilisateur
      await interaction.reply({
        content: `✅ Ticket créé avec succès! ${ticketChannel}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      await interaction.reply({
        content: '❌ Erreur lors de la création du ticket!',
        ephemeral: true,
      }).catch(() => {});
    }
  },
};