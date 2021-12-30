const { Command } = require("reconlx");
const ms = require('ms')
const warnModel = require('../../models/warnSchema');

module.exports = new Command({
    name: 'timeout',
    description: 'timeout a member',
    //user, length (length of timeout), reason
    userPermissions: ["MUTE_MEMBERS"],
    options: [
        {
            name: 'target',
            description: 'member to perform the timeout on',
            type: 'USER',
            required: true
        },
        {
            name: 'length',
            description: "length of timeout",
            type: "STRING",
            required: true
        },
        {
            name: "reason",
            description: "reason for timeout",
            type: "STRING",
            required: true
        }
    ],
    run: async({ client, interaction }) => {
        const user = interaction.options.getUser('target')
        const length = interaction.options.getString("length")
        const reason = interaction.options.getString("reason")
        const member = interaction.guild.members.cache.get(user.id)
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({content: 'I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.', ephemeral: true})

        if (member.id === interaction.guild.ownerId) return interaction.followUp({content: 'I cannot warn the owner of the server.', ephemeral: true})

        if (member.id === interaction.user.id) return interaction.followUp({content: 'You cannot warn yourself.', ephemeral: true})

        if (member.id === interaction.guild.me.id) return interaction.followUp({content: 'I cannot warn myself.', ephemeral: true})
        if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ content: 'You can not take action on this user as their role is heigher than yours'});

        const timeInMs = ms(length);
        if(!timeInMs) return interaction.followUp({ content: 'Please specify a valid time!'});
        if(interaction.guild.members.cache.get(user.id).isCommunicationDisabled()) return interaction.followUp({ content: interaction.user+ `, looks like this user is already timed out.`})

        member.timeout(timeInMs, reason);
        await new warnModel({
            userID: user.id,
            guildID: interaction.guildId,
            moderatorID: interaction.user.id,
            reason,
            timestamp: Date.now()
        }).save();
        interaction.followUp({content: `${user} has been timeouted for ${length}! (\`Reason: ${reason}\`)`})



    }
})