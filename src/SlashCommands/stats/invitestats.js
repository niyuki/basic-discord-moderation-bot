const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Invite = require('../../models/inviteschema')
const { Command } = require('reconlx')

module.exports = new Command({
    name: 'invitestats',
    description: 'See invite stats of user',
    userPermissions: ["SEND_MESSAGES"],
    botPermissions: ["EMBED_LINKS"],
    type: "CHAT_INPUT",
    options: [{
        name: 'target',
        type: 'USER',
        description: 'Get data of user.'
    }],
    
     run: async ({client, interaction, args}) => {
        const user = interaction.options.getUser("target") || interaction.user
        
        const data = await Invite.findOne({ userID: user.id }) || {Regular: 0, Leave: 0, inviterID: undefined, Bonus: 0,Fake: 0 };
        
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle('**'+user.username+'** '+'Invite Stats of the user')
            .setDescription(`Total: ${data.Regular + data.Bonus}, Regular: ${data.Regular}, Fake: ${data.Fake}, Exits: ${data.Leave}`)
            .setFooter(interaction.user.username, interaction.user.avatarURL({dynamic: true}))
        interaction.followUp({embeds: [embed]})
    }
})