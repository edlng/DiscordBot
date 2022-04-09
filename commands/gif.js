const fetch = require('node-fetch');

module.exports = {
    name: 'gif',
    aliases: ['g'],
    description: "this is a gif command!",
    async execute(client, message, cmd, args, Discord){

      let tokens = message.content.split(" ");
      if (tokens.length > 1) {
        answer = tokens.slice(1, tokens.length).join("+");
      } else {
        let answers = ["funny", "memes"] // Default choices
        let choice = Math.floor(Math.random() * answers.length);
        answer = answers[choice];
      }

      let url = `https://g.tenor.com/v1/search?q=${answer}&key=${process.env.TENOR_KEY}`;
      let response = await fetch(url);
      let json = await response.json();
      let index = Math.floor(Math.random() * json.results.length);

      message.channel.send(json.results[index].url);
    }
}