const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')

module.exports = new Command({
    name: 'logchannel',
    description: 'Sets the logchannel for actions',
    userPermissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'channel',
            description: 'The channel to set',
            type: 'CHANNEL',
            channelTypes: ["GUILD_TEXT"],
            required: true
        }
    ],
    run: async({client, interaction, args}) => {
        const embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })});

        const channel = interaction.options.getChannel('channel')
        await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $set: { PunishLogChannelID: channel.id } });
        return interaction.followUp({ embeds: [embed.setDescription('Log channel has been set to **<#'+channel.id+'>**')]}).catch(() => {});
    },
});