const Discord = require('discord.js');
const MessageHandler = require('./messageHandler');
const client = new Discord.Client();
const messageHandler = new MessageHandler(client);
require('dotenv').config();

client.on('ready', () => console.log('Bot is now connected'));

client.on('guildMemberAdd', (member) => {
  console.log(
    `New User "${member.user.username}" has joined "${member.guild.name}"`
  );
  member.guild.channels
    .find('name', 'general')
    .send(`"${member.user.username}" has joined this server`);
});

client.on('guildMemberRemove', (member) => {
  console.log(`User "${member.user.username}" has left "${member.guild.name}"`);
  member.guild.channels
    .find('name', 'general')
    .send(`"${member.user.username}" has left this server`);
});

messageHandler.init();

client.login(process.env.token);
