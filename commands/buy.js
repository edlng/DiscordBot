const profileModel = require('../models/profileSchema');


module.exports = {
    name: "buy",
    aliases: [],
    permissions: [],
    description: "Buy random",
    async execute(client, message, cmd, args, Discord, profileData) {
        let randomNum = Math.floor(Math.random() * 1000);
        let boughtItem = "";
        if (randomNum >= 50) {
            boughtItem = getRandomItem(0);
        } else if (randomNum > 1 && randomNum < 50) {
            boughtItem = getRandomItem(1);
        } else if (randomNum <= 1) {
            boughtItem = getRandomItem(2);
        }
        if (profileData.coins >= 200) {
            updateBoughtItems(message, boughtItem, profileData, Discord);
        } else {
            message.channel.send(`${message.author.username} you do not have enough coins.`);
        }
    }
}

function getRandomItem(rarityNumber) {
    let commonItems = ["Bread", "Milk", "Rice"];
    let rareItems = ["Salad", "Salmon", "Ham & Cheese Sandwich"];
    let legendaryItems = ["Medium Rare Steak", "Caviar", "Wine"];
    if (rarityNumber == 0) {
        return commonItems[Math.floor(Math.random() * commonItems.length)];
    } else if (rarityNumber == 1) {
        return rareItems[Math.floor(Math.random() * rareItems.length)];
    }
    return legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
}

async function updateSchema(message, boughtItem, profileData) {
    if (profileData.items[boughtItem] == undefined || isNaN(profileData.items[boughtItem])) {
        let itemField = `items.${boughtItem}`;
        await profileModel.findOneAndUpdate({ 
            userID: message.author.id 
        }, { 
            $set: {[itemField]: 1}
        });
    }
}

async function updateBoughtItems(message, boughtItem, profileData, Discord) {
    await updateSchema(message, boughtItem, profileData);
    let itemField = `items.${boughtItem}`;
    if (boughtItem && !isNaN(profileData.items[boughtItem])) {
        let selectedItem = profileData.items[boughtItem];
        await profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            $set: {
                [itemField]: selectedItem + 1,
                'coins': profileData.coins - 200
            }
        });
    } else {
        updateSchema(message, boughtItem, profileData);
    }
    sendNewBalance(boughtItem, message, profileData, Discord);
}

async function sendNewBalance(boughtItem, message, profileData, Discord) {
    let embed = new Discord.MessageEmbed()
    .setTitle("You got...");
    let newBalance = await profileData.coins - 200;
    switch (boughtItem) {
        case "Bread":
            embed.setColor("#88ff88");
            embed.addField("Common", `${message.author} has baked some bread! Balance is now ${newBalance} TupacCoins`);
            break;
        case "Rice":
            embed.setColor("#0096FF");
            embed.addField("Rare", `${message.author} ate some rice! Balance is now ${newBalance} TupacCoins`);
            break;
        case "Milk":
            embed.setColor("#88ff88");
            embed.addField("Common", `${message.author} poured themselves a glass of milk. Balance is now ${newBalance} TupacCoins`);
            break;
        case "Salad":
            embed.setColor("#88ff88");
            embed.addField("Common", `${message.author} is staying healthy today! Balance is now ${newBalance} TupacCoins`);
            break;
        case "Salmon":
            embed.setColor("#0096FF");
            embed.addField("Rare", `${message.author} caught some salmon! Balance is now ${newBalance} TupacCoins`);
            break;
        case "Ham & Cheese Sandwich":
            embed.setColor("#0096FF");
            embed.addField("Rare", `${message.author} is hammy and chessy! Balance is now ${newBalance} TupacCoins`);
            break;
        case "Medium Rare Steak":
            embed.setColor("#ffcb3b");
            embed.addField("LEGENDARY", `${message.author} is eating good today! Balance is now ${newBalance} TupacCoins`);
            break;
        case "Caviar":
            embed.setColor("#ffcb3b");
            embed.addField("LEGENDARY", `${message.author} is tasting caviar! Balance is now ${newBalance} TupacCoins`);
            break;
        case "Wine":
            embed.setColor("#ffcb3b");
            embed.addField("LEGENDARY", `${message.author} is tasting the finest wine! Balance is now ${newBalance} TupacCoins`);
            break;
    }
    message.channel.send(embed);
}