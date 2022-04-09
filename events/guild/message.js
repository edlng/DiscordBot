const profileModel = require('../../models/profileSchema');

module.exports = async (Discord, client, message) => {
    const prefix = '!';
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                coins: 1000,
                hasPerms: false,
                ownerPerms: false,
                items: {}
            })
            profile.save();
        }
    } catch (err) {
        console.error(err);
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    

    if(command) command.execute(client, message, cmd, args, Discord, profileData);

    
}