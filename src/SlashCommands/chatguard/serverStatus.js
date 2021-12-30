const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
const config = require('../../config.json')
const chatModel = require('../../models/chatGSchema')
module.exports = new Command({
    name: 'serverstatus',
    description: 'See which events you activated',
    userPermissions: ["ADMINISTRATOR"],
    run: async({client, interaction, args}) => {
        const embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })});

        const Database = await chatModel.findOne({ ServerID: interaction.guild.id });
        if(Database) {
            interaction.followUp({ embeds: [new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true })})
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setDescription(`
        __**Systems**__
        \`•\` **Character Limit:** ${Database.CharacterLimit ? '\`✔️\`' : '\`❌\`'}
        \`•\` **Invite Guard:** ${Database.InviteGuard ? '\`✔️\`' : '\`❌\`'}
        \`•\` **Link Guard:** ${Database.LinkGuard ? '\`✔️\`' : '\`❌\`'}
        \`•\` **MassPing Guard:** ${Database.MassPingGuard ? '\`✔️\`' : '\`❌\`'}
        \`•\` **BadWord Guard:** ${Database.BadWordGuard ? '\`✔️\`' : '\`❌\`'}
        \`•\` **Spam Guard:** ${Database.SpamGuard ? '\`✔️\`' : '\`❌\`'}
     
        __**WHITELIST**__
        \`>\` Whitelisted members: ${Database.WhiteListMembers ? Database.WhiteListMembers.map(id => `<@${id}>`).join('\n') : 'No whitelisted members'}
        \`>\` Whitelisted roles: ${Database.WhiteListRoles ? Database.WhiteListRoles.map(id => `<@&${id}>`).join('\n') : 'No whitelisted roles'}
        \`>\` Whitelisted channels: ${Database.WhiteListChannels ? Database.WhiteListChannels.map(id => `<#${id}>`).join('\n') : 'No whitelisted channels'}
 
        __**OTHER SYSTEMS**__
        \`•\`**Filterred Words**: ${Database.FiltredWords ? Database.FiltredWords.join() : 'No filterred words.'}
        \`•\`**Timeout Duration**: ${Database.MuteDurationMinute ?""+Database.MuteDurationMinute+" minutes." : '60'}
        \`•\`**Log Channel**: ${Database.PunishLogChannelID ? "<#"+Database.PunishLogChannelID+">" : 'No log channel set.'}
        \`•\`To see other cmds feel free to check ${client.config.prefix}chatg
  `)]}).catch(() => {}); 
}

        if(!Database) {
            interaction.followUp({ embeds: [new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor({name : interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true })})
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setDescription(`
                __**Systems**__
                \`•\` **Character Limit:** \`❌\`
                \`•\` **Invite Guard:** \`❌\`
                \`•\` **Link Guard:** \`❌\`
                \`•\` **MassPing Guard:**\`❌\`
                \`•\` **BadWord Guard:** \`❌\`
                \`•\` **Spam Guard:** \`❌\`
             
                __**WHITELIST**__
                \`>\` Whitelisted members: **No whitelisted members**
                \`>\` Whitelisted roles: **No whitelisted roles**
                \`>\` Whitelisted channels: **No whitelisted channels**
                \`•\`To see other cmds feel free to check ${client.config.prefix}chatg
            `)]}).catch(() => {}); 
        }

    }
});