const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')

module.exports = new Command({
    name: 'badwordguard',
    description: 'Enables or disables the badwordguard',
    userPermissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'setting',
            description: 'True -> Enable | False -> Disable',
            type: 'BOOLEAN',
            required: true
        }
    ],
    run: async({client, interaction, args}) => {
        const embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })});

        const setting = interaction.options.getBoolean('setting')
        const Database = await chatModel.findOne({ServerID: interaction.guild.id});
        if(setting) {
            if(Database && Database.BadWordGuard == true) return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, This System is already enabled.')]}).catch(() => {});

            await chatModel.findOneAndUpdate({ServerID: interaction.guild.id}, { BadWordGuard: true }, {upsert: true});
            return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, **Bad Word Guard** succesfully enabled.')]}).catch(() => {});
        } else {
            if(!Database || Database.BadWordGuard == false)  return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, This System is already disabled.')]}).catch(() => {});
            await chatModel.findOneAndUpdate({ServerID: interaction.guild.id}, { BadWordGuard: false }, {upsert: true});
            return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, **Bad Word Guard** succesfully disabled.')]}).catch(() => {});
        
        }
    },
});