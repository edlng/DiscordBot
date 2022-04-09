const got = require("got");

module.exports = {
  name: 'youtube',
  aliases: ['y', 'yt'],
  description: "this is a YouTube command!",
  execute(client, message, cmd, args, Discord) {
    let choice = args.join("+")
    const embed = new Discord.MessageEmbed()
    got('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + choice + '&maxResults=25&key=AIzaSyD8-mysI4BYgVad518iFka-U3gPhoIQPvQ').then(response => {
      let content = JSON.parse(response.body);
      let searchChoice = Math.floor(Math.random() * content.items.length);
      let videoId = content.items[searchChoice].id.videoId;
      let videoLink = "https://www.youtube.com/watch?v=" + videoId;
      message.channel.send(videoLink);

    });
  }
}