const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  customId: 'remove_user_modal',
  async execute(interaction) {
    const userId = interaction.fields.getTextInputValue('user_id_input');

    try {
      const user = await interaction.client.users.fetch(userId);

      await interaction.channel.permissionOverwrites.edit(user, {
        ViewChannel: false,
        SendMessages: false,
        ReadMessageHistory: false,
      });

      const embed = new EmbedBuilder()
        .setColor(config.colors.warning)
        .setTitle('➖ Utilisateur Retiré')
        .setDescription(`${user.username}#${user.discriminator} a été retiré du ticket`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors du retrait d\'utilisateur:', error);
      await interaction.reply({
        content: '❌ Erreur! Vérifiez que l\'ID utilisateur est correct.',
        ephemeral: true,
      });
    }
  },
};
