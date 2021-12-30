const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')

module.exports = new Command({
    name: 'remove-punish',
    description: 'Removes the penalty of a user',
    userPermissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'member',
            description: 'Member to remove the penalty',
            type: 'USER',
            required: true
        }
    ],
    run: async({client, interaction, args}) => {
        const embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })});

        var member = interaction.options.getMember("member")
        const Database = await chatModel.findOne({ ServerID: interaction.guild.id });

        if(!Database) return  interaction.followUp({ embeds: [embed.setDescription('**<@'+member.user.id+'>**, named user does not have any penalties')]}).catch(() => {});

        if(Database.BlueListMembers.includes(member.user.id) === true) {
            await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $pull: { BlueListMembers: member.user.id } });
            return  interaction.followUp({ embeds: [embed.setDescription('**<@'+member.user.id+'>**, named user\'s warn is succesfully removed.')]}).catch(() => {});
        }
        
        if(Database.BlackListMembers.includes(member.user.id) === true) {
            await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $pull: { BlackListMembers: member.user.id } });
            member.timeout(null).catch(() => {});

            return interaction.followUp({ embeds: [embed.setDescription('**<@'+member.user.id+'>**, named user\'s mute is succesfully removed.')]}).catch(() => {});
        }
        if(Database.BlueListMembers.includes(member.user.id) === false || Database.BlackListMembers.includes(member.user.id) === false) return  interaction.followUp({ embeds: [embed.setDescription('**<@'+member.user.id+'>**, named user does not have any penatly for this.')]}).catch(() => {});
    
    },
});