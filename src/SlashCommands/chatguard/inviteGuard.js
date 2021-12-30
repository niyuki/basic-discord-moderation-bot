const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')

module.exports = new Command({
    name: 'inviteguard',
    description: 'Enables or disables the inviteguard',
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
            if(Database && Database.InviteGuard == true) return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, This System is already enabled.')]}).catch(() => {});
            await chatModel.findOneAndUpdate({ServerID: interaction.guild.id}, { InviteGuard: true }, {upsert: true});
            return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, **Invite Guard** succesfully enabled.')]}).catch(() => {});
        } else {
            if(!Database || Database.InviteGuard == false)  return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, This System is already disabled.')]}).catch(() => {});
            await chatModel.findOneAndUpdate({ServerID: interaction.guild.id}, { InviteGuard: false }, {upsert: true});
            return interaction.followUp({ embeds: [embed.setDescription('<@'+interaction.user.id+'>, **Invite Guard** succesfully disabled.')]}).catch(() => {});
        }
    },
});