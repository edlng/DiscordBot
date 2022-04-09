const got = require('got');

module.exports = {
  name: 'gs',
  aliases: ['goog', 'google'],
  description: "this is a ping command!",
  async execute(client, message, cmd, args, Discord) {

    let squery = args.join("+");
    let randnum = Math.floor(Math.random() * 40);
    if (args.length <= 0) {
      message.channel.send("Empty query.");
    } else {
      try {
        await got(`https://www.googleapis.com/customsearch/v1?key=AIzaSyD8-mysI4BYgVad518iFka-U3gPhoIQPvQ&cx=36d4e31a321031239&q=${squery}&start=${randnum}&num=10&searchType=image`).then(response => {
          let content = JSON.parse(response.body);
          let choice = Math.floor(Math.random() * content.items.length);
          let image = content.items[choice].link;
          message.channel.send(image);
        })
      } catch (error) {
        message.channel.send(`As non-patreons, you can only use this command 100 times per day.`);
      }
    }
  }
}