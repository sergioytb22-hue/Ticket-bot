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
  customId: /^color_modal_.+$/,
  async execute(interaction) {
    const colorType = interaction.customId.split('_')[2];
    const hexColor = interaction.fields.getTextInputValue('hex_color');
    const config = loadConfig();

    // Vérifier que c'est un code hex valide
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexColor)) {
      return await interaction.reply({
        content: '❌ Format invalide! Utilisez un code hexadécimal valide (ex: #FF0000)',
        ephemeral: true,
      });
    }

    try {
      config.colors[colorType] = hexColor;
      saveConfig(config);

      await interaction.reply({
        content: `✅ Couleur ${colorType} modifiée en ${hexColor}!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erreur lors de la modification de la couleur:', error);
      await interaction.reply({
        content: '❌ Erreur lors de la modification de la couleur!',
        ephemeral: true,
      });
    }
  },
};