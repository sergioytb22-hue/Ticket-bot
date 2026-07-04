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
  customId: 'main_config_select',
  async execute(interaction) {
    const choice = interaction.values[0];
    const config = loadConfig();

    try {
      if (choice === 'manage_categories') {
        const embed = new EmbedBuilder()
          .setColor(config.colors.primary)
          .setTitle('📝 Gestion des Catégories')
          .setDescription('Catégories actuelles:')
          .addFields(
            ...config.categories.map(cat => ({
              name: `${cat.emoji} ${cat.label}`,
              value: `ID: ${cat.name}`,
              inline: true
            }))
          );

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (choice === 'customize_colors') {
        const embed = new EmbedBuilder()
          .setColor(config.colors.primary)
          .setTitle('🎨 Couleurs Actuelles')
          .addFields(
            { name: 'Primaire', value: config.colors.primary, inline: true },
            { name: 'Succès', value: config.colors.success, inline: true },
            { name: 'Erreur', value: config.colors.error, inline: true },
            { name: 'Avertissement', value: config.colors.warning, inline: true },
            { name: 'Info', value: config.colors.info, inline: true }
          );

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (choice === 'customize_messages') {
        const embed = new EmbedBuilder()
          .setColor(config.colors.primary)
          .setTitle('💬 Messages Personnalisés')
          .addFields(
            { name: 'Message de bienvenue', value: config.messages.welcome, inline: false },
            { name: 'Max de tickets par user', value: config.messages.maxTickets.toString(), inline: true },
            { name: 'Préfixe des tickets', value: config.messages.ticketPrefix, inline: true }
          );

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (choice === 'limits_prefs') {
        const embed = new EmbedBuilder()
          .setColor(config.colors.primary)
          .setTitle('⚙️ Limites & Préférences')
          .addFields(
            { name: 'Nombre maximum de tickets par utilisateur', value: config.messages.maxTickets.toString(), inline: false },
            { name: 'Préfixe des canaux de tickets', value: config.messages.ticketPrefix, inline: false }
          );

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (choice === 'preview_config') {
        const embed = new EmbedBuilder()
          .setColor(config.colors.primary)
          .setTitle('👁️ Aperçu Complet de la Configuration')
          .addFields(
            { name: '📝 Catégories', value: `${config.categories.length} catégories`, inline: true },
            { name: '🎨 Couleurs', value: '5 couleurs personnalisées', inline: true },
            { name: '💬 Messages', value: 'Messages configurés', inline: true },
            { name: '📊 Statistiques', value: `Max tickets: ${config.messages.maxTickets}`, inline: true }
          )
          .setDescription('Configuration complète du système de tickets');

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      console.error('Erreur lors du traitement du menu de configuration:', error);
      return await interaction.reply({
        content: '❌ Erreur lors du traitement de la configuration!',
        ephemeral: true,
      });
    }
  },
};