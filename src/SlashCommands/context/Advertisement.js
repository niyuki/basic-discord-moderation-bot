const { Client, ContextMenuInteraction } = require('discord.js')
const warnModel = require('../../models/warnSchema')
const config = require('../../config.json')
module.exports = {
    name: 'Advertisement',
    type: "USER",
    userPermissions: ["BAN_MEMBERS"],
    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client,interaction, args) => {
        if(!interaction.member.roles.cache.get(config.ContextTimeouts.hammers.banRole)) return interaction.followUp({ content: 'You can not take action on this user as you do not have permissions for this'});
        const member = interaction.guild.members.cache.get(interaction.targetId)
        if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ content: 'You can not take action on this user as their role is heigher than yours'});
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({content: 'I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.', ephemeral: true})

        if (member.id === interaction.guild.ownerId) return interaction.followUp({content: 'I cannot warn the owner of the server.', ephemeral: true})

        if (member.id === interaction.user.id) return interaction.followUp({content: 'You cannot warn yourself.', ephemeral: true})

        if (member.id === interaction.guild.me.id) return interaction.followUp({content: 'I cannot warn myself.', ephemeral: true})
        let reason = 'Advertising'
        await member.send(`You have been banned from **${interaction.guild.name}**, reason: ${reason}. You shouldn't do ads here lol. 😥`).catch(console.log)
        await new warnModel({
            userID: member.user.id,
            guildID: interaction.guildId,
            moderatorID: interaction.user.id,
            reason: `ban: advertisement`,
            timestamp: Date.now()
        }).save();
        member.ban({ reason});

        interaction.followUp({content: `Punished **${member.user.username}** succesfully because of advertising! Feel free to say Bye Bye to him :c`})
        }
}