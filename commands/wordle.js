const fs = require('fs');

module.exports = {
    name: "wordle",
    aliases: [],
    description: "Game command",
    async execute(client, message, cmd, args, Discord) {
        allWords = fs.readFileSync(`data/fiveletterwords.txt`).toString().split("\n");
        word = allWords[Math.floor(Math.random() * allWords.length)];
        username = await getAuthorDisplayName(message);
        const filter = m => (m.content.length == 5);
        const collector = message.channel.createMessageCollector(filter, { max: 6 });
        message.channel.send("Starting wordle game... Please enter a 5 letter word")
        collector.on('collect', m => {
            copyWord = word;
            result = "";
            for (let i = 0; i < word.length; i++) {
                if (word[i] === m.content[i]) {
                    result += ":green_square:";
                    copyWord = copyWord.replace(m.content[i], '')
                } else if (word[i] !== m.content[i] && copyWord.includes(m.content[i])) {
                    result += ":yellow_square:";
                    copyWord = copyWord.replace(m.content[i], ''); 
                } else {
                    result += ":black_large_square:";
                }
            }
            message.channel.send(result);
            if (wonTheGame(result)) {
                message.channel.send("Congratulations " + username + "!!!");
                collector.stop()
            }
        });

        collector.on('end', () =>  message.channel.send("The answer was: " + word));
    }
}


const wonTheGame = (result) => {
    return (result.length * 5) === 350;
}

const getAuthorDisplayName = async (msg) => {
    const member = await msg.guild.members.fetch(msg.author);
    return member ? member.nickname : msg.author.username;
}