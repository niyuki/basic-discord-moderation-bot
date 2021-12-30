const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = { "Prefix":"/"}
module.exports = new Command({
    name: 'cguard',
    description: 'See how chat guard commands are used',
    userPermissions: ["ADMINISTRATOR"],
    run: async({client, interaction, args}) => {

        interaction.followUp({ embeds: [new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({name :interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true })})
            .setTitle('Chat Guard Commands')
            .setTimestamp()
            .setDescription(`
    \`•\` :star: Check server status: \`${"/"}serverstatus\`

    \`•\` To get members a role or channel to whitelist: \`${"/"}whitelist [add or remove] [role or channel or üye](mention or id)\`
    
    \`•\` To set a filtered word so it won't be used in server: \`${"/"}filter [add or remove] [word]\`

    \`•\` To set mute duration: \`${"/"}timeoutduration 10 [Enter the time in minute] \`

    \`•\` To set log channel: \`${"/"}logchannel @channel [mention or id]\`

    \`•\` To remove the punishment of a specific user who has been punished on the server: \`${"/"}penaltyremove @user [mention or id] \`
    
    \`•\` To delete messages that have been written too long on the server and filled in the chat: \`${"/"}characterlimit [true or false] \`
    
    \`•\` To not share invitation links from other servers on the server: \`${"/"}inviteguard [true or false] \`
    
    \`•\` To prevent sharing any links on the server: \`${"/"}linkguard [true or false] \`
    
    \`•\` To prevent many people from being mentioned in a Message on the server: \`${"/"}masspingguard [true or false] \`

    \`•\` To avoid sending swear messages on the server: \`${"/"}badwordguard [true or false] \`

    \`•\` To avoid spam in the server: \`${"/"}spamguard [true or false] \`
    
      `)]}).catch(() => {});

    }
});