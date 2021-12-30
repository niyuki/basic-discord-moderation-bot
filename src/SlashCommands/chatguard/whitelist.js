const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')

module.exports = new Command({
    name: 'whitelist',
    description: 'Add or remove mentionable for whitelist',
    userPermissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'add',
            description: 'Add to whitelist',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to add',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'channel',
                            description: 'Get it here so I can take actions.',
                            type: 'CHANNEL',
                            channelTypes: ["GUILD_TEXT"],
                            required: true
                        }
                    ],
                    
                },
                {
                    name: 'role',
                    description: 'The role to add',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'role',
                            description: 'Get it here so I can take actions.',
                            type: 'ROLE',
                            required: true
                        }
                    ],
                },
                {
                    name: 'user',
                    description: 'The user to add',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'user',
                            description: 'Get it here so I can take actions.',
                            type: 'USER',
                            required: true
                        }
                    ],
                },
            ],
        },
        {
            name: 'remove',
            description: 'remove from whitelist',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to remove',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'channel',
                            description: 'Get it here so I can take actions.',
                            type: 'CHANNEL',
                            channelTypes: ["GUILD_TEXT"],
                            required: true
                        }
                    ],
                    
                },
                {
                    name: 'role',
                    description: 'The role to remove',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'role',
                            description: 'Get it here so I can take actions.',
                            type: 'ROLE',
                            required: true
                        }
                    ],
                },
                {
                    name: 'user',
                    description: 'The user to remove',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'user',
                            description: 'Get it here so I can take actions.',
                            type: 'USER',
                            required: true
                        }
                    ],
                },
            ],
        },
    ],
    run: async({client, interaction, args}) => {
        const embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })});

        const Database = await chatModel.findOne({ ServerID: interaction.guild.id });    
        switch (interaction.options.getSubcommandGroup()) {
            case 'add':
                switch(interaction.options.getSubcommand()){
                    case 'role':
                        const rolee = interaction.options.getRole("role")
                        if (Database && Database.WhiteListRoles.includes(rolee.id))  return interaction.followUp({ embeds: [embed.setDescription('**<@&'+rolee.id+'>**, named role is already whitelisted.')]}).catch(() => {});
                        await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $push: { WhiteListRoles: rolee.id } }, { upsert: true });
                        interaction.followUp({ embeds: [embed.setDescription('**<@&'+rolee.id+'>**, named role has succesfully been added to whitelist.')]});    
                    break;
                    case 'user':
                        const userr = interaction.options.getUser("user")
                        if (Database && Database.WhiteListMembers.includes(userr.id)) return interaction.followUp({ embeds: [embed.setDescription('**<@'+userr.id+'>**, named user is already whitelisted.')]}).catch(() => {});
                        await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $push: { WhiteListMembers: userr.id } }, { upsert: true });
                        interaction.followUp({ embeds: [embed.setDescription('**<@'+userr.id+'>**, named user has succesfully been added to whitelist.')]});
                    break;
                    case 'channel':
                        const channell = interaction.options.getChannel("channel")
                        if (Database && Database.WhiteListChannels.includes(channell.id)) return interaction.followUp({ embeds: [embed.setDescription('**<#'+channell.id+'>**, named channel is already whitelisted.')]}).catch(() => {});
      
                        await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $push: { WhiteListChannels: channell.id } }, { upsert: true });
                        interaction.followUp({ embeds: [embed.setDescription('**<#'+channell.id+'>**, named channel has succesfully been added to whitelist.')]}).catch(() => {});    
                    break;
                }
                break;
            case 'remove': 
                switch(interaction.options.getSubcommand()){
                    case 'channel':
                        const channel = interaction.options.getChannel("channel")
                        if (!Database || !Database.WhiteListChannels.includes(channel.id)) return interaction.followUp({ embeds: [embed.setDescription('**<#'+channel.id+'>**, named channel is already not in whitelist.')]});
     
                        await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $pull: { WhiteListChannels: channel.id }});
                         interaction.followUp({ embeds: [embed.setDescription('**<#'+channel.id+'>**, named channel has succesfully been removed from whitelist.')]}).catch(() => {});
               
                    break;
                    case 'user':
                        const user = interaction.options.getUser("user")
                        if (!Database || !Database.WhiteListMembers.includes(user.id)) return interaction.followUp({ embeds: [embed.setDescription('**<@'+user.id+'>**, named user is already not in whitelist.')]}).catch(() => {});
       
                        await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $pull: { WhiteListMembers: user.id } } );
                         interaction.followUp({ embeds: [embed.setDescription('**<@'+user.id+'>**, named user has succesfully been removed from whitelist.')]}).catch(() => {});
                    break;
                    case 'role':
                        const role = interaction.options.getRole("role")
                        if (!Database || !Database.WhiteListRoles.includes(role.id)) return interaction.followUp({ embeds: [embed.setDescription('**<@&'+role.id+'>**, named role is already not in whitelist.')]}).catch(() => {});
         
                        await chatModel.findOneAndUpdate({ ServerID: interaction.guild.id }, { $pull: { WhiteListRoles: role.id } } );
                        interaction.followUp({ embeds: [embed.setDescription('**<@&'+role.id+'>**, named role has succesfully been removed from whitelist.')]});    
                    break;
                }
                break;
            default:
                break;
        }
    },
});