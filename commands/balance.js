module.exports = {
    name: "balance",
    aliases: ["bal"],
    permissions: [],
    description: "Check the user balance",
    execute(client, message, cmd, args, Discord, profileData) {
        try {
            message.channel.send(`You have ${profileData.coins} TupacCoins`);
        } catch (err) {
            message.channel.send(`Initializing account data... Please try again`);
        }
    }
}