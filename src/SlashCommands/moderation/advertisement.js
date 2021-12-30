const { Command } = require('reconlx')
const { Client, MessageEmbed } = require('discord.js')
const warnModel = require('../../models/warnSchema');

module.exports = new Command({
    name: 'ads',
    description: 'punish advertising member',
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: 'target',
            description: 'target to ban',
            type: 'USER',
            required: true
        },
        {
            name: 'imagelink',
            description: 'the proof that target did ads on DM',
            type: 'STRING',
            required:true
        }
    ],
    run: async({client, interaction, args}) => {

        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason');

        if(target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ content: 'You can not take action on this user as their role is heigher than yours'});
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({content: 'I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.', ephemeral: true})

        if (member.id === interaction.guild.ownerId) return interaction.followUp({content: 'I cannot warn the owner of the server.', ephemeral: true})

        if (member.id === interaction.user.id) return interaction.followUp({content: 'You cannot warn yourself.', ephemeral: true})

        if (member.id === interaction.guild.me.id) return interaction.followUp({content: 'I cannot warn myself.', ephemeral: true})
        if(![".jpg", ".png", ".webp"].some(a => reason.includes(a))) return interaction.followUp({content: 'Please provide a valid member and also an imagelink of that he sent an discord invite'})
        await target.send(`You have been banned from **${interaction.guild.name}**, reason: ${reason}. You shouldn't do ads here lol. 😥`).catch(console.log)
        await new warnModel({
            userID: target.user.id,
            guildID: interaction.guildId,
            moderatorID: interaction.user.id,
            reason: `Ban Advertisement: ${reason}`,
            timestamp: Date.now()
        }).save();
        target.ban({ reason});

        interaction.followUp({content: `Punished **${target.user.username}** succesfully because of advertising! Feel free to say Bye Bye to him :c Reason: ${reason}`})
    }
})