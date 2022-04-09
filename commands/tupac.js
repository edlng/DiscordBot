const {MessageEmbed} = require('discord.js')

module.exports = {
    name: 'tupac',
    aliases: ['tu'],
    description: "The magic tupac",
    execute(client, message, cmd, args, Discord){
        if(!args[2]) return message.reply("The magic Tupac says: Ask a full question");
        let replies = ["The magic TupacBot says: 100% guaranteed.", "The magic TupacBot says: I don't know", "The magic TupacBot says: its better not to say"];

        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(0).join(" ");

        let ballembed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag)
        .setColor("#FF9900")
        .addField("Question: ", question)
        .addField("Response: ", replies[result]);

        message.channel.send(ballembed);
    }

}