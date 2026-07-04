const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
    console.log(`📊 Serveurs: ${client.guilds.cache.size}`);
    console.log(`👥 Utilisateurs: ${client.users.cache.size}`);
    
    // Définir le statut du bot
    client.user.setActivity('!ticket help | Tickets', { type: 'WATCHING' });
  },
};