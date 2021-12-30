const { Message,MessageEmbed, Client } = require("discord.js");
const ms = require('ms')
module.exports = {
    name: "remove-timeout",
    aliases: ['rt'],
    description: 'Remove the timeout of the mentioned member',
    useage: '<Mention Member> [reason]',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.members.first()
        
        const reason = args.slice(1).join(' ') || 'no reason provided'



        if(!message.channel.permissionsFor(message.guild.me).has('MODERATE_MEMBERS')){
            message.channel.send('I am missing `ADMINISTRATOR` or `TIMEOUT_MEMBERS` permission. Please give me one to use this command ') }
            if(!message.member.permissions.has('MODERATE_MEMBERS')){
            return message.channel.send('You are missing `ADMINISTRATOR` or `TIMEOUT_MEMBERS` permission.') }
        if (user.roles.highest.position > message.member.roles.highest.position || user.roles.highest.position === message.member.roles.highest.position) return message.channel.send('You cannot remove timeout of someone with an equal or higher role');

        
        
        user.timeout(null, reason);
        message.channel.send(`Removed Timeout of the member: ${user.user.tag.toString()}`);
    },
};
