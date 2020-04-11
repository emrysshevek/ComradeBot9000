'use strict';

// Import the discord.js module
const Discord = require('discord.js');

// Import auth token
const auth = require('./auth.json');

// Create an instance of a Discord client
const client = new Discord.Client({
   token: auth.token,
   autorun: true
});

var guild;

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('Connected');
    console.log('Logged in as: ' + client.user.username);

    // Create an instance of the Discord guild
    guild = client.guilds.cache.get('697812456289992745');
    console.log('Guild is available: ' + guild.available.toString());
});

// Create an event listener for messages
client.on('message', message => {
  if (message.content.substring(0, 1) === '!') {
      var args = message.content.substring(1).split(' ');
      var cmd = args[0];
      args = args.splice(1);
      switch(cmd) {
            case 'hello':
                message.channel.send(`Hello Comrade ${message.author}!`);
                break;
            case 'timezone':
                var zone = parseInt(args[0]);
                timezone(zone, message.channel, message.member);
                break;
      }
  }
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the SocLit's Virtual Book Group, Comrade ${member}! Join the Revolution!`);
});

function timezone(offset, channel, member){
    if (!Number.isNaN(offset) && offset >= -12 && offset <= 14) {
        var text = 'Your timezone has been updated to ';
        var zone = '';
        if (offset === 0) {
            zone = 'UTC+/-0';
        }
        else if (offset > 0) {
            zone = 'UTC+' + offset.toString();
        }
        else {
            zone = 'UTC-' + Math.abs(offset).toString();
        }

        var old_role = getRoleByName('UTC', member.roles.cache, true);
        if (old_role){
            member.roles.remove(old_role);
        }

        var role = getRoleByName(zone);
        if (!role){
            guild.roles.create({
                data: {name: zone, mentionable: true, hoist: true, position: offset}
            }).then(
                r => member.roles.add(r)
            );
        }
        else {
            member.roles.add(role);
        }
        channel.send(text + zone);
    }
    else {
        channel.send('Timezone is missing or unknown. Correct format is:\n`!timezone [offset from UTC]`\nExample: !timezone -5');
    }
}


function getRoleByName(name, roles=guild.roles.cache, partial=false){
    for (const id of roles.keys()) {
        var r = roles.get(id);
        if (partial && r.name.includes(name)){
            return r
        }
        else if (r.name === name) {
            return r;
        }
    }
    return null;
}

// // Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);