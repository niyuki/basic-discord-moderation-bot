const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config.json')
const afkschema = require('../../models/afkschema')


module.exports = {
    name: 'afk',
    description: 'Get AFK',
    userPermissions: ["SEND_MESSAGES"],
    botPermissions: ["EMBED_LINKS"],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if(config.mongooseConnectionString) {
            const content = args.join(" ") || 'I will brb just chill fam';
            let embed = new MessageEmbed()
                .setColor(message.member.displayColor)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            const data = await afkschema.findOne({ guild: message.guild.id, user: message.author.id })
            if(!data) {
                await new afkschema(
                     { guild: message.guild.id , user: message.author.id, reason: content }
                ).save()
                message.channel.send({embeds: [embed.setColor("BLURPLE").setDescription(`You have been set to afk\n\n`+`\n**__Reason__:** \n \`${content}\` `)]})
            } else {
                await afkschema.findOneAndUpdate({
                    guild: message.guild.id,
                    user: message.author.id,
                    reason: content
                });
                message.channel.send({embeds: [embed.setDescription(`Your afk status has been updated!\n\n`+` **__Reason__:** \n \`${content}\` `)]})
            }
        } else {
            message.reply({ content: 'Please enter mongopath to use afk mode!'})
        }   
    }
}