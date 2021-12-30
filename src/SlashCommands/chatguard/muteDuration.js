const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')

module.exports = new Command({
    name: 'muteduration',
    description: 'Enables or disables the badwordguard',
    userPermissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'duration',
            description: 'Number in minutes',
            type: 'NUMBER',
            required: true
        }
    ],
    run: async({client, interaction, args}) => {
        const embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })});

        const setting = interaction.options.getNumber('duration')
        if(setting < 1) return interaction.followUp({ embeds: [embed.setDescription(':x: Example usage: **'+"/"+'muteduration 15 (Enter time in minutes.)**')]}).catch(() => {});
        await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $set: { MuteDurationMinute: args[0] } });
        return interaction.followUp({ embeds: [embed.setDescription('Succesfully mute duration has been set to **'+args[0]+'**, minutes.')]}).catch(() => {});
   
    },
});