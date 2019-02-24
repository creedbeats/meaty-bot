const { token } = require('minimist')(process.argv.slice(2));
const Discord = require('discord.js');
const MessageHandler = require('./messageHandler');
const client = new Discord.Client();
const messageHandler = new MessageHandler(client);

client.on('ready', () => console.log('Bot is now connected'));

client.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);
  member.guild.channels.get('welcome').send(`"${member.user.username}" has joined this server`);
});

messageHandler.init();

client.login(token);