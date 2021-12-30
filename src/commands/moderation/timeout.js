const { Message,MessageEmbed, Client } = require("discord.js");
const ms = require('ms')
module.exports = {
    name: "timeout",
    description: 'Give the e=mentioned member timeout',
    useage: '<Mention Member> <Time> [reason]',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.members.first()
        const length = args[1]
        const reason = args.slice(2).join(' ')  || 'no reason provided'



        if(!message.channel.permissionsFor(message.guild.me).has('MODERATE_MEMBERS')){
            message.channel.send('I am missing `ADMINISTRATOR` or `TIMEOUT_MEMBERS` permission. Please give me one to use this command ') }
            if(!message.member.permissions.has('MODERATE_MEMBERS')){
            return message.channel.send('You are missing `ADMINISTRATOR` or `TIMEOUT_MEMBERS` permission.') }
        if (user.roles.highest.position > message.member.roles.highest.position || user.roles.highest.position === message.member.roles.highest.position) return message.channel.send('You cannot timeout someone with an equal or higher role');

        const timer = ms(length);
        if (!timer)
        return message.channel.send("Please specify the time!");
        const Tembed = new MessageEmbed()
        .setTitle('Timeout')
        .setThumbnail(user.displayAvatarURL({ dynamic: true}))
        .setColor('DARK_PURPLE')
        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .addFields(
            {
                name: 'Member Name',
                value: user.user.tag.toString(),
                inline: false
            },
            {
                name: 'Reason',
                value: `${reason.toString()}`,
                inline: false
            },
            {
                name: 'Time',
                value: `${length.toString()}`,
                inline: true
            }
            )
        .setTimestamp()
        
        user.timeout(timer, reason);
        message.channel.send(
            {
                embeds: [Tembed]
            }
        );
    },
};
