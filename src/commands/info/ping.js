const { Message, Client, MessageEmbed } = require("discord.js");
const pm = require('pretty-ms');

module.exports = {
    name: "ping",
    aliases: ['p'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const msg = await message.channel.send({ content: "🏓 Pinging..."});

        const botLatency = pm(msg.createdTimestamp - message.createdTimestamp)
        const shardLatency = pm(message.guild.shard.ping);
        
        const embed = new MessageEmbed()
          .setAuthor('🏓Pong!')
          .setColor('BLURPLE')
          .addFields({
              name: 'Message Latency:',
              value: `${botLatency}`,
              inline: true
            }, {
              name: `Shard ${` | ${message.guild.shard.id} Latency:`}`,
              value: `${shardLatency}`,
              inline: true
            })
        await msg.edit({embeds: [embed]})
    },
};
