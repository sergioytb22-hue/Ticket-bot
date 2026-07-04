const { EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = {
  customId: 'main_config_select',
  async execute(interaction) {
    const choice = interaction.values[0];
    const config = loadConfig();

    try {
      if (choice === 'color_primary' || choice === 'color_success' || choice === 'color_error' || choice === 'color_warning' || choice === 'color_info') {
        const colorMap = {
          'color_primary': 'primary',
          'color_success': 'success',
          'color_error': 'error',
          'color_warning': 'warning',
          'color_info': 'info'
        };
        const colorKey = colorMap[choice];

        const modal = new ModalBuilder()
          .setCustomId(`color_modal_${colorKey}`)
          .setTitle(`Modifier la couleur ${colorKey}`);

        const colorInput = new TextInputBuilder()
          .setCustomId('hex_color')
          .setLabel('Code hexadécimal (ex: #FF0000)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder('#5865F2')
          .setMaxLength(7);

        const row = new ActionRowBuilder().addComponents(colorInput);
        modal.addComponents(row);

        return await interaction.showModal(modal);
      }

      if (choice === 'preview_config') {
        const embed = new EmbedBuilder()
          .setColor(config.colors.primary)
          .setTitle('👁️ Aperçu Complet de la Configuration')
          .addFields(
            { name: '📝 Catégories', value: `${config.categories.length} catégories`, inline: true },
            { name: '🎨 Couleurs', value: '5 couleurs personnalisées', inline: true },
            { name: '💬 Messages', value: 'Messages configurés', inline: true },
            { name: 'Primaire', value: config.colors.primary, inline: true },
            { name: 'Succès', value: config.colors.success, inline: true },
            { name: 'Erreur', value: config.colors.error, inline: true },
            { name: 'Avertissement', value: config.colors.warning, inline: true },
            { name: 'Info', value: config.colors.info, inline: true }
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