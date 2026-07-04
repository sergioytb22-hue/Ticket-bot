const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  customId: 'add_user_modal',
  async execute(interaction) {
    const userId = interaction.fields.getTextInputValue('user_id_input');

    try {
      const user = await interaction.client.users.fetch(userId);

      await interaction.channel.permissionOverwrites.edit(user, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });

      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('➕ Utilisateur Ajouté')
        .setDescription(`${user.username}#${user.discriminator} a été ajouté au ticket`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'utilisateur:', error);
      await interaction.reply({
        content: '❌ Erreur! Vérifiez que l\'ID utilisateur est correct.',
        ephemeral: true,
      });
    }
  },
};