const { GuildMemberRoleManager } = require('discord.js');
const { Command } = require('reconlx');
const warnModel = require('../../models/warnSchema');

module.exports = new Command({
    name: 'warn',
    description: 'warn a member',
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: 'target',
            description: 'target you want to warn',
            type: "USER",
            required:true
        },
        {
            name: "reason",
            description: "reason for this warn",
            type: "STRING",
            required: true,
        }
    ],
    run: async({client, interaction}) => {
        const member = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason');
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({content: 'I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.', ephemeral: true})

        if (member.id === interaction.guild.ownerId) return interaction.followUp({content: 'I cannot warn the owner of the server.', ephemeral: true})

        if (member.id === interaction.user.id) return interaction.followUp({content: 'You cannot warn yourself.', ephemeral: true})

        if (member.id === interaction.guild.me.id) return interaction.followUp({content: 'I cannot warn myself.', ephemeral: true})
        if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ content: 'You can not take action on this user as their role is heigher than yours'});

        await new warnModel({
            userID: member.id,
            guildID: interaction.guildId,
            moderatorID: interaction.user.id,
            reason,
            timestamp: Date.now()
        }).save();

        member.send({ 
            content:
             `
                You have been warned in ${interaction.guild.name} for ${reason}`
            }).catch(console.log);

        interaction.followUp({ content: '**'+member.username+'** '+` user has been warned for ${reason}`})
    }
})