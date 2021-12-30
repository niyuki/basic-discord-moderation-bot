const { Command } = require('reconlx')

module.exports = new Command({
    name: "unban",
    description: "unban user",
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: 'id',
            description: 'ID to unban',
            type:"STRING",
            required: true
        },
    ],
    run: async({client, interaction}) => {
        const userId = interaction.options.getString('id');
        const translatedmsg =  ` user is unbanned from this server!`
        const translatedmsg2 = 'Please enter valid ID so I can unban. huh😋'
        interaction.guild.members.unban(userId).then(async(user) => {
            interaction.followUp({ content: user.tag+' '+translatedmsg})
        }).catch(() => {
            interaction.followUp({ content: translatedmsg2})
        })

    }
})