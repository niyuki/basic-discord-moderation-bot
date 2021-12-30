const { Client, ContextMenuInteraction } = require('discord.js')
const warnModel = require('../../models/warnSchema')
const config = require('../../config.json')
const moment = require('moment')
module.exports = {
    name: 'Provoking',
    type: "MESSAGE",
    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client,interaction, args) => {
        if(!interaction.member.roles.cache.get(config.ContextTimeouts.hammers.timeoutRole)) return interaction.followUp({ content: 'You can not take action on this user as you do not have permissions for this'});
        const msg = await interaction.channel.messages.fetch(interaction.targetId)
        const Database = await warnModel.findOne({ userID: msg.author.id, reason: 'provoking'})
        const durationtimeout = ms(config.ContextTimeouts.provokingTimeout)
        if(!Database){
            interaction.followUp({ content: msg.author+ `, looks like you are provoking people. This is your first warning. If you repeat you will get timeouted. (\`${msg.content}\` doesn't fit here so I'm timing him out for ${config.ContextTimeouts.provokingTimeout})😳`})
            await new warnModel({
                userID: msg.author.id,
                guildID: interaction.guildId,
                moderatorID: interaction.user.id,
                reason: 'provoking',
                timestamp: Date.now()
            }).save();
        } else {
            if(interaction.guild.members.cache.get(msg.author.id).isCommunicationDisabled()) return interaction.followUp({ content: interaction.user+ `, looks like this user is already timed out.`})
            interaction.guild.members.cache.get(msg.author.id).timeout(durationtimeout, 'Provoking')
            interaction.followUp({ content: msg.author+ `, looks like you are provoking again. Since you were already warned at ${moment(Database.timestamp).format('LLLL')}. (\`${msg.content}\` doesn't fit here so I'll time him out for ${config.ContextTimeouts.provokingTimeout})😳`})
            setTimeout(async() => {
                await warnModel.findOneAndDelete({ userID: msg.author.id, reason: 'provoking'});
                if(interaction.guild.members.cache.get(msg.author.id)) await interaction.guild.members.cache.get(msg.author.id).timeout(null)
            }, durationtimeout);
        }
    }
}