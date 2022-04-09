const fs = require('fs');

module.exports = (client, Discord) => {
  const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

  client.on('message', message => {
    if (!message.content.startsWith("!") || message.author.bot) {
      return;
    } else {
      for (const file of command_files) {
        const command = require(`../commands/${file}`);
        if (command.name) {
          client.commands.set(command.name, command);
        } else {
          continue;
        }
      }
    }
  })


}