const { Command } = require('reconlx')
const { Client, MessageEmbed } = require('discord.js')
const warnModel = require('../../models/warnSchema');
const insulter = require('insult')
module.exports = new Command({
    name: 'kick',
    description: 'kick member',
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name: 'target',
            description: 'target to kick',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'reason for this kick',
            type: 'STRING',
            required:false
        }
    ],
    run: async({client, interaction, args}) => {

        const member = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({content: 'I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.', ephemeral: true})

        if (member.id === interaction.guild.ownerId) return interaction.followUp({content: 'I cannot warn the owner of the server.', ephemeral: true})

        if (member.id === interaction.user.id) return interaction.followUp({content: 'You cannot warn yourself.', ephemeral: true})

        if (member.id === interaction.guild.me.id) return interaction.followUp({content: 'I cannot warn myself.', ephemeral: true})
        if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ content: 'You can not take action on this user as their role is heigher than yours'});
        const embed = new MessageEmbed().setColor("2f3136").setImage('https://66.media.tumblr.com/556b2147292718d9225a510467b9314e/tumblr_mu42zblt0b1svp3buo3_500.gif').setDescription(`You have been kicked from **${interaction.guild.name}**, reason: ${reason}. I'm sorry 😥. Anyways, ${insulter.Insult()}.`)

        await member.send({ embeds: [embed]})

        member.kick(reason);
        await new warnModel({
            userID: member.id,
            guildID: interaction.guildId,
            moderatorID: interaction.user.id,
            reason: 'Kick: '+reason,
            timestamp: Date.now()
        }).save();
        interaction.followUp({content: `Kicked **${member.user.username}** succesfully! Reason: ${reason}`})
    }
})