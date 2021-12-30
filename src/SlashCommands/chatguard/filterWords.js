const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')

module.exports = new Command({
    name: 'filterwords',
    description: 'Add or remove filtered words for actions',
    userPermissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'add',
            description: 'Add filtered word to database',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'word',
                    description: 'The word to add',
                    type: 'STRING',
                    required: true
                }
            ],
        },
        {
            name: 'remove',
            description: 'Remove filtered word from database',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'word',
                    description: 'The word to remove',
                    type: 'STRING',
                    required: true
                }
            ],
        },
    ],
    run: async({client, interaction, args}) => {
        const embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })});
        const word = interaction.options.getString("word")
        const Database = await chatModel.findOne({ ServerID: interaction.guild.id });    
        switch (interaction.options.getSubcommand()) {
            case 'add':
            if (Database && Database.FiltredWords.includes(word) === true) return interaction.followUp({ embeds: [embed.setDescription('**'+word+'**, This word is already filtered.')]}).catch(() => {});
            await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $push: { FiltredWords: word } }, { upsert: true });
            interaction.followUp({ embeds: [embed.setDescription('**'+word+'**, succesfully added to filter.')]}).catch(() => {});
                break;
            case 'remove': 
                if (!Database || Database.FiltredWords.includes(word) !== true) return interaction.followUp({ embeds: [embed.setDescription('**'+word+'**, This word is already not filtered.')]}).catch(() => {});
                await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $pull: { FiltredWords: word }});
                 interaction.followUp({ embeds: [embed.setDescription('**'+word+'**, succesfully removed from filter.')]}).catch(() => {}); 
                break;
            default:
                break;
        }
    },
});