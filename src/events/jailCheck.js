const client = require('../index')
const config = require('../config.json')
const jailModel = require('../models/jailSchema');
const insulter = require('insult');
const moment= require('moment')
const { MessageEmbed } = require('discord.js');

client.on('guildMemberAdd', async(member) => {
    if(member.bot) return;
    const data = await jailModel.findOne({ userID: member.id})
    const channel = member.guild.channels.cache.get(config.Welcome.channel)
    if(data) {
        member.roles.set(config.Jail.roles);
        const embed = new MessageEmbed().setColor("2f3136").setImage('https://66.media.tumblr.com/556b2147292718d9225a510467b9314e/tumblr_mu42zblt0b1svp3buo3_500.gif').setDescription(`Did you really think I will forget your jail when you quit and rejoin OwO. Anyways, ${insulter.Insult()}.`)
        await member.send({ embeds: [embed]}).catch(console.log);
        if(channel) channel.send({ content: `OwO looks like ${member} tried to quit and rejoin thinking I would forget him.. But how can I forgive the ${data.reason} until ${moment(data.timestamp+data.duration)}, which is ${moment(data.timestamp+data.duration).fromNow()}`})
    } else {
        member.roles.add(config.Welcome.role)
        const embed = new MessageEmbed().setColor("2f3136").setImage('https://66.media.tumblr.com/556b2147292718d9225a510467b9314e/tumblr_mu42zblt0b1svp3buo3_500.gif').setDescription(`\`${member.guild.memberCount.toLocaleString()} ${'member'}\`\n`+`Welcome to the server, to get you started make sure to read information's rules.\nIf you have any questions or you need help with your anything feel free chat and chill here.`)
        if(channel) channel.send({ embeds: [embed]})
    }
})