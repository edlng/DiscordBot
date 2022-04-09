const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    serverID: { type: String, required: true },
    coins: { type: Number, default: 1000},
    hasPerms: { type: Boolean, default: false },
    ownerPerms: { type: Boolean, default: false },
    items: { type: Object, default: {}}
})

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;