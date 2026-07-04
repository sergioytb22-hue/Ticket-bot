module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      // Handle slash commands
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
          console.error(`Command not found: ${interaction.commandName}`);
          return await interaction.reply({
            content: '❌ Cette commande n\'existe pas!',
            ephemeral: true,
          }).catch(() => {});
        }

        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error('Command execution error:', error);
          const errorMsg = { content: '❌ Erreur lors de l\'exécution de la commande!', ephemeral: true };
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMsg).catch(() => {});
          } else {
            await interaction.reply(errorMsg).catch(() => {});
          }
        }
      }

      // Handle select menus
      if (interaction.isStringSelectMenu()) {
        const select = client.selects.get(interaction.customId);
        
        if (!select) {
          console.error(`Select menu not found: ${interaction.customId}`);
          return await interaction.reply({
            content: '❌ Ce menu déroulant n\'existe pas!',
            ephemeral: true,
          }).catch(() => {});
        }

        try {
          await select.execute(interaction, client);
        } catch (error) {
          console.error('Select menu execution error:', error);
          const errorMsg = { content: '❌ Erreur lors du traitement du menu!', ephemeral: true };
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMsg).catch(() => {});
          } else {
            await interaction.reply(errorMsg).catch(() => {});
          }
        }
      }

      // Handle buttons
      if (interaction.isButton()) {
        let button = client.buttons.get(interaction.customId);
        
        // Si pas trouvé, chercher avec regex
        if (!button) {
          for (const [key, value] of client.buttons) {
            if (key instanceof RegExp && key.test(interaction.customId)) {
              button = value;
              break;
            }
          }
        }

        if (!button) {
          console.error(`Button not found: ${interaction.customId}`);
          return;
        }

        try {
          await button.execute(interaction, client);
        } catch (error) {
          console.error('Button execution error:', error);
          const errorMsg = { content: '❌ Erreur!', ephemeral: true };
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMsg).catch(() => {});
          } else {
            await interaction.reply(errorMsg).catch(() => {});
          }
        }
      }

      // Handle modals
      if (interaction.isModalSubmit()) {
        let modal = client.modals.get(interaction.customId);
        
        // Si pas trouvé, chercher avec regex
        if (!modal) {
          for (const [key, value] of client.modals) {
            if (key instanceof RegExp && key.test(interaction.customId)) {
              modal = value;
              break;
            }
          }
        }

        if (!modal) {
          console.error(`Modal not found: ${interaction.customId}`);
          return;
        }

        try {
          await modal.execute(interaction, client);
        } catch (error) {
          console.error('Modal execution error:', error);
          const errorMsg = { content: '❌ Erreur!', ephemeral: true };
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMsg).catch(() => {});
          } else {
            await interaction.reply(errorMsg).catch(() => {});
          }
        }
      }
    } catch (error) {
      console.error('Interaction error:', error);
    }
  },
};
