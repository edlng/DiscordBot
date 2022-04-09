const profileModel = require('../../models/profileSchema');

module.exports = async(client, discord, member) => {
    let profile = await profile.create({
        userID: member.id,
        serverID: member.guild.id,
        coins: 1000,
        hasPerms: false,
        ownerPerms: false,
        items: {}
    });
    profile.save();
}