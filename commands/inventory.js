const profileModel = require('../models/profileSchema');

module.exports = {
    name: "inventory",
    aliases: ["inv"],
    permissions: [],
    description: "See what you have in your inventory",
    async execute(client, message, cmd, args, Discord, profileData) {
        let commonItems = ["Bread", "Rice", "Milk"];
        let rareItems = ["Salad", "Salmon", "Ham & Cheese Sandwich"];
        let legendaryItems = ["Medium Rare Steak", "Caviar", "Wine"];

        let name = message.author.username;
        let embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(name + "'s Inventory");
        let inventory = await profileData.items;
        let sortedCommon = [];
        let sortedRare = [];
        let sortedLegendary = [];
        for (const [key, value] of Object.entries(inventory)) {
            if (commonItems.includes(key)) {
                sortedCommon.push(`${key}: ${value}`);
            } else if (rareItems.includes(key)) {
                sortedRare.push(`${key}: ${value}`);
            } else if (legendaryItems.includes(key)) {
                sortedLegendary.push(`${key}: ${value}`);
            }
        }
        if (sortedCommon.length > 0) {
            embed.addField(`Common Items:`, sortedCommon.join('\n'), true);
        }
        if (sortedRare.length > 0) {
            embed.addField(`Rare Items:`, sortedRare.join('\n'), true);
        }
        if (sortedLegendary.length > 0) {
            embed.addField(`Legendary Items:`, sortedLegendary.join('\n'), true);
        }
        message.channel.send(embed);
    }
}