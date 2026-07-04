const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  customId: 'confirm_close_ticket',
  async execute(interaction) {
    // Vérifier les permissions
    if (!interaction.member.permissions.has('ManageMessages')) {
      return await interaction.reply({
        content: '❌ Vous n\'avez pas la permission de fermer ce ticket !',
        ephemeral: true,
      });
    }

    try {
      const ticketCreatorId = interaction.channel.topic?.split('Creator: ')[1];
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      const transcript = messages
        .reverse()
        .map(msg => `[${msg.createdAt.toLocaleString('fr-FR')}] ${msg.author.username}: ${msg.content}`)
        .join('\n');

      const transcriptEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle(`📋 Retranscription du Ticket - ${interaction.channel.name}`)
        .setDescription('Voici la conversation du ticket que vous avez fermé')
        .addFields(
          { name: 'Salon', value: interaction.channel.name, inline: true },
          { name: 'Fermé par', value: interaction.user.username, inline: true },
          { name: 'Date de fermeture', value: new Date().toLocaleString('fr-FR'), inline: true }
        )
        .setFooter({ text: `ID du canal: ${interaction.channel.id}` });

      // Envoyer la transcription à la personne qui a ouvert le ticket
      if (ticketCreatorId) {
        try {
          const creator = await interaction.client.users.fetch(ticketCreatorId);
          await creator.send({ embeds: [transcriptEmbed] });
          
          if (transcript.length > 0) {
            const transcriptContent = transcript.substring(0, 2000); // Limite Discord
            await creator.send({
              content: `\`\`\`\n${transcriptContent}\`\`\``,
            });
          }
        } catch (err) {
          console.error('Erreur lors de l\'envoi de la transcription:', err);
        }
      }

      const ticketData = {
        closedBy: interaction.user.tag,
        closedAt: new Date().toLocaleString('fr-FR'),
        channel: interaction.channel.name,
      };

      const embed = new EmbedBuilder()
        .setColor(config.colors.error)
        .setTitle('🔒 Ticket Fermé')
        .setDescription('Ce ticket a été fermé\n✅ Retranscription envoyée à la personne qui a ouvert le ticket')
        .addFields(
          { name: 'Fermé par', value: ticketData.closedBy, inline: true },
          { name: 'Date', value: ticketData.closedAt, inline: true }
        );

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        await interaction.channel.delete().catch(console.error);
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de la fermeture du ticket:', error);
      await interaction.reply({
        content: '❌ Erreur lors de la fermeture du ticket!',
        ephemeral: true,
      });
    }
  },
};