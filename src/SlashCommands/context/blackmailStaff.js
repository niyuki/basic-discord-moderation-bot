const { Client, ContextMenuInteraction } = require('discord.js')
const warnModel = require('../../models/warnSchema')
const config = require('../../config.json')
const moment = require('moment')
module.exports = {
    name: 'Blackmail Staff',
    type: "MESSAGE",
    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client,interaction, args) => {
        const msg = await interaction.channel.messages.fetch(interaction.targetId)
        const Database = await warnModel.findOne({ userID: msg.author.id, reason: 'blackmail'})
        const durationtimeout = ms(config.ContextTimeouts.blackmailTimeout)
        const durationjail = ms(config.ContextTimeouts.blackmailJail)
        if(!Database){
            if(interaction.guild.members.cache.get(msg.author.id).isCommunicationDisabled()) return interaction.followUp({ content: interaction.user+ `, looks like this user is already timed out.`})
            interaction.guild.members.cache.get(msg.author.id).timeout(durationtimeout, 'Blackmail Staff')
            interaction.followUp({ content: msg.author+ `, looks like you are blackmailing staff. This is your first warning. If you repeat you will get jailed. (\`${msg.content}\` doesn't fit here so I'm timing him out for ${config.ContextTimeouts.blackmailTimeout})😳`})
            await new warnModel({
                userID: msg.author.id,
                guildID: interaction.guildId,
                moderatorID: interaction.user.id,
                reason: 'blackmail',
                timestamp: Date.now()
            }).save();
        } else {
            const roles = [];
            member.roles.cache.map(a => roles.push(a.id))
            await new jailModel({
                userID: msg.author.id,
                moderatorID: interaction.user.id,
                timestamp: Date.now(),
                reason: 'blackmail 2nd Time',
                oldRoles: roles,
                duration: durationjail,
            }).save();
            await interaction.guild.members.cache.get(msg.author.id).roles.set(config.Jail.roles)
            interaction.followUp({ content: msg.author+ `, looks like you are blackmailing staff again. Since you were already warned at ${moment(Database.timestamp).format('LLLL')}. (\`${msg.content}\` doesn't fit here so I'll jail him out for ${config.ContextTimeouts.blackmailJail})😳`})
            setTimeout(async() => {
                await warnModel.findOneAndDelete({ userID: msg.author.id, reason: 'blackmail'});
                if(interaction.guild.members.cache.get(msg.author.id)) await interaction.guild.members.cache.get(msg.author.id).roles.set(roles)
            }, durationjail);
        }
    }
}