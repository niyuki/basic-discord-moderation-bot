const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')

module.exports = new Command({
    name: 'spamguard',
    description: 'Enables or disables the spamguard',
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
            if(Database && Database.SpamGuard == true) return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, This System is already enabled.')]}).catch(() => {});
            await chatModel.findOneAndUpdate({ServerID: interaction.guild.id}, { SpamGuard: true }, {upsert: true});
            return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, **Spam Guard** succesfully enabled.')]}).catch(() => {});
        } else {
            if(!Database || Database.SpamGuard == false)  return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, This System is already disabled.')]}).catch(() => {});
            await chatModel.findOneAndUpdate({ServerID: interaction.guild.id}, { SpamGuard: false }, {upsert: true});
            return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, **Spam Guard** succesfully disabled.')]}).catch(() => {});
       
        }
    },
});