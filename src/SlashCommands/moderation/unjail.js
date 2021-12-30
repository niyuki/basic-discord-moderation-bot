const { Command } = require('reconlx');
const jailModel = require('../../models/jailSchema');

module.exports = new Command({
    name: 'unjail',
    description: 'remove a jail using id',
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "userid",
            description: "userID that you want to delete",
            type: "STRING",
            required: true,
        }
    ],
    run: async({client, interaction}) => {
        const jailID = interaction.options.getString('userid')
        
        const data = await jailModel.findOne({ userID: jailID});

        if(!data) return interaction.followUp({
            content: `${jailID} is not a valid jailled user id or he has not received any jail yet OwO!`
        });
        const msg = `Looks like ${interaction.user} has removed your jail from ${interaction.guild} so I gave your old roles. You should thank him OwO`
        const user = interaction.guild.members.cache.get(data.userID);
        user.roles.set(data.oldRoles).then(() => user.send({ content: msg}))
        interaction.followUp({ content:
            `Removed the Jail of ${user} and added him his old roles he had before.`
        })
        await jailModel.findOneAndDelete({ userID: jailID });
    }
})