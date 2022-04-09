const { query } = require("mathram");


module.exports = {
  name: 'wolfram',
  aliases: ['wolf'],
  description: "this is a wolfram command!",
  async execute(client, message, cmd, args, Discord) {
    try {
      let answer = await query(args.slice(0).join(" "));

      if ((answer.queryresult.pods[0].title == "Results") || answer.queryresult.pods[0].title == "Derivative") {
        return [message.channel.send(answer.queryresult.pods[0].subpods[0].img.src),
        message.channel.send(answer.queryresult.pods[0].subpods[1].img.src)];
      } else {
        return [message.channel.send(answer.queryresult.pods[1].subpods[0].img.src),
        message.channel.send(answer.queryresult.pods[1].subpods[1].img.src)];
      }
    } catch (error) {
      message.channel.send("Unable to perform task. " + error);
    }
        

    }
}
