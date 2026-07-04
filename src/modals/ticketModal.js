const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../ticketConfig.json');

function loadConfig() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {
    categories: [
      { name: 'support', label: 'Support', emoji: '🆘' },
      { name: 'report', label: 'Signalement', emoji: '📋' },
      { name: 'appeal', label: 'Appel', emoji: '⚖️' },
      { name: 'partnership', label: 'Partenariat', emoji: '🤝' }
    ],
    colors: {
      primary: '#5865F2',
      success: '#57F287',
      error: '#ED4245',
      warning: '#FEE75C',
      info: '#00B0F4'
    },
    messages: {
      welcome: 'Bienvenue dans ce ticket de support!',
      maxTickets: 3,
      ticketPrefix: 'ticket'
    }
  };
}

module.exports = {
  customId: /^ticket_modal_.+$/,
  async execute(interaction) {
    const category = interaction.customId.split('_')[2];
    const categoryData = loadConfig().categories.find(c => c.name === category);
    const subject = interaction.fields.getTextInputValue('ticket_subject');
    const description = interaction.fields.getTextInputValue('ticket_description');
    const config = loadConfig();

    if (!categoryData) {
      return await interaction.reply({
        content: '❌ Catégorie non trouvée!',
        ephemeral: true,
      });
    }

    try {
      const { ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
      const ticketNumber = Math.floor(Math.random() * 10000);
      const channelName = `ticket-${category}-${ticketNumber}`;

      // Créer le canal du ticket
      const ticketChannel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        topic: `Ticket #${ticketNumber} | ${categoryData.label} | Créé par ${interaction.user.username} | Creator: ${interaction.user.id}`,
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