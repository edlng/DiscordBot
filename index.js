const PORT = process.env.PORT || 5000;

const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();

const profileModel = require('./models/profileSchema');

const fs = require('fs');

const mongoose = require('mongoose');

const setStatusFile = require('./commands/status');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, Discord);
})

async function establishConnection() {
  await mongoose.connect(process.env.MONGODB_SRV, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to the database');
  }).catch((err) => {
    console.log(err);
  })
}

establishConnection();


client.on("ready", () => {
  setStatusFile.statusFunction(client);
  setInterval(() => setStatusFile.statusFunction(client), 1200000);
});

client.on("message", message => {
  if (message.content.toLowerCase() == "!shutdown") { 
      message.channel.send("Shutting down...").then(() => {
          client.destroy();
      })
  }
})


client.login(process.env.DISCORD_TOKEN);

