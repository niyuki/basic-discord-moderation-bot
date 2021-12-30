const { Command } = require('reconlx');
const warnModel = require('../../models/warnSchema');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
module.exports = new Command({
    name: "warnings",
    description: "display all warnings that a user has",
    userPermissions: ["MANAGE_MESSAGES"],
    options:[
        {
            name: "target",
            description: "user you want to view warnings on",
            type: "USER",
            required: true
        },

    ],
    run: async({client, interaction}) => {
        const user = interaction.options.getUser('target')

        const userWarnings = await warnModel.find({
            userID: user.id,
            guildID: interaction.guildId
        });

        if(!userWarnings?.length) return interaction.followUp(
            {
                content: '**'+user.username+'** '+ ` user has no warnings in the server`
            }
        );
        
        const translatedmsg = 'Has Left'

        const embedDescription = userWarnings.map((warn) => {
            const moderator = interaction.guild.members.cache.get(warn.moderatorID);

            return `
                **Moderator**: ${moderator || translatedmsg}(\`${warn.moderatorID}\`)
                \`\`\`fix\nwarnID: ${warn._id}
                \nDate: ${moment(warn.timestamp).format("MMMM Do YYYY")} (${moment(warn.timestamp).fromNow()})
                \n= Reason: ${warn.reason}\`\`\`
            `

        }).join("\n\n");

        const embed = new MessageEmbed()
            .setTitle(user.username+' '+'user\'s warnings')
            .setDescription(embedDescription)
            .setColor("RANDOM")
            .setTimestamp()
            .setAuthor(user.username, user.displayAvatarURL({dynamic:true}))
            .setFooter(interaction.user.username, interaction.user.displayAvatarURL({dynamic:true}))

        interaction.followUp({embeds: [embed]})
    }
})