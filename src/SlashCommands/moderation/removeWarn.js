const { Command } = require('reconlx');
const warnModel = require('../../models/warnSchema');

module.exports = new Command({
    name: 'remove-warn',
    description: 'remove a warn using id',
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "warnid",
            description: "warnID that you want to delete",
            type: "STRING",
            required: true,
        }
    ],
    run: async({client, interaction}) => {
        const warnID = interaction.options.getString('warnid')
        
        const data = await warnModel.findById(warnID);

        if(!data) return interaction.followUp({
            content: `${warnID} is not a valid warn id!`
        });

        data.delete();

        const user = interaction.guild.members.cache.get(data.userID);
        interaction.followUp({ content:
            `Removed 1 of ${user}'s warnings.`
        })
    
    }
})