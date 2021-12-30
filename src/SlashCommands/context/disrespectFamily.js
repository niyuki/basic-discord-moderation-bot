const { Client, ContextMenuInteraction } = require('discord.js')
const warnModel = require('../../models/warnSchema')
const config = require('../../config.json')
const moment = require('moment')
module.exports = {
    name: 'Disrespect Family',
    type: "USER",
    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client,interaction, args) => {
        if(!interaction.member.roles.cache.get(config.ContextTimeouts.hammers.banRole)) return interaction.followUp({ content: 'You can not take action on this user as you do not have permissions for this'});

        const member = interaction.guild.members.cache.get(interaction.targetId)
        const Database = await warnModel.findOne({ userID: msg.author.id, reason: 'Disrespecting family'})
        const Database2 = await jailModel.findOne({ userID: msg.author.id, reason: 'Disrespecting family'})

        if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ content: 'You can not take action on this user as their role is heigher than yours'});
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({content: 'I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.', ephemeral: true})

        if (member.id === interaction.guild.ownerId) return interaction.followUp({content: 'I cannot warn the owner of the server.', ephemeral: true})

        if (member.id === interaction.user.id) return interaction.followUp({content: 'You cannot warn yourself.', ephemeral: true})

        if (member.id === interaction.guild.me.id) return interaction.followUp({content: 'I cannot warn myself.', ephemeral: true})
        let reason = 'Disrespecting family'
        const durationtimeout = ms(config.ContextTimeouts.disrespectTimeout)
        const durationjail = ms(config.ContextTimeouts.disrespectTimeout)
        if(!Database) {
            await new warnModel({
                userID: member.user.id,
                guildID: interaction.guildId,
                moderatorID: interaction.user.id,
                reason: reason,
                timestamp: Date.now()
            }).save();
            if(interaction.guild.members.cache.get(member.user.id).isCommunicationDisabled()) return interaction.followUp({ content: interaction.user+ `, looks like this user is already timed out.`})

            interaction.guild.members.cache.get(member.user.id).timeout(durationtimeout, 'Disrespecting family')
            interaction.followUp({ content: member.user.user+ `, looks like you are disrespecting family values. This is your first warning. If you repeat you will get jailed and one more to get banned. (\`${msg.content}\` doesn't fit here so I'm timing him out for ${config.ContextTimeouts.disrespectTimeout})😳`})
    
        } else {
            if(!Database2) {
                const roles = [];
            member.roles.cache.map(a => roles.push(a.id))
            await new jailModel({
                userID: member.user.id,
                moderatorID: interaction.user.id,
                timestamp: Date.now(),
                reason: reason+' 2nd Time',
                oldRoles: roles,
                duration: durationjail,
            }).save()
            await interaction.guild.members.cache.get(member).roles.set(config.Jail.roles)
            interaction.followUp({ content: interaction.user+ `, looks like you are disrespecting families again. Since you were already warned at ${moment(Database.timestamp).format('LLLL')}. (\`${msg.content}\` doesn't fit here so I'll jail him out for ${config.ContextTimeouts.disrespectJail})😳`})
            setTimeout(async() => {
                await warnModel.findOneAndDelete({ userID: member.user.id, reason: 'Disrespecting family'});
                if(interaction.guild.members.cache.get(member.user.id)) await interaction.guild.members.cache.get(member.user.id).roles.set(roles)
            }, durationjail);
            } else {
                await member.send(`You have been banned from **${interaction.guild.name}**, reason: ${reason}. You shouldn't do that still after 2 times. 😥`).catch(console.log)
        await new warnModel({
            userID: member.user.id,
            guildID: interaction.guildId,
            moderatorID: interaction.user.id,
            reason: 'Disrespecting family 3rd Time -> BAN',
            timestamp: Date.now()
        }).save();
        member.ban({ reason});
        await jailModel.findOneAndDelete({ userID: member.user.id, reason: 'Disrespecting family 2nd Time'});
        interaction.followUp({content: `Punished **${member.user.username}** succesfully because of disrespecting multiple times! Feel free to say Bye Bye to him :c`})
        
            }
        }
    }
}