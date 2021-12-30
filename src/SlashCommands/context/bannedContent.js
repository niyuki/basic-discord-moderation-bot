const { Client, ContextMenuInteraction } = require('discord.js')
const ms = require('ms')
const config = require('../../config.json')
const warnModel = require('../../models/warnSchema')

module.exports = {
    name: 'banned/unwanted Content',
    type: "MESSAGE",
    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client,interaction, args) => {
    
        const msg = await interaction.channel.messages.fetch(interaction.targetId)
        
        const duration = ms(config.ContextTimeouts.BannedContentTimeout)
        await new warnModel({
            userID: msg.author.id,
            guildID: interaction.guildId,
            moderatorID: interaction.user.id,
            reason: 'Sharing banned/unwanted content in channels.',
            timestamp: Date.now()
        }).save();
        if(interaction.guild.members.cache.get(msg.author.id).isCommunicationDisabled()) return interaction.followUp({ content: interaction.user+ `, looks like this user is already timed out.`})
        interaction.guild.members.cache.get(msg.author.id).timeout(duration, 'Sharing banned/unwanted content in wrong channels.')
        
        interaction.followUp({ content: interaction.user+ `, looks like you are using command outside of the purposes (\`${msg.content}\` doesn't fit here so I'm timing him out for ${config.ContextTimeouts.BannedContentTimeout})😳`})

    }
}