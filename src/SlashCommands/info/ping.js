const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const pm = require('pretty-ms');
const { Command } = require('reconlx')

module.exports = new Command({
    name: "ping",
    description: "returns websocket ping",
    type: 'CHAT_INPUT',

    
    run: async ({client, interaction, args}) => {

        const msg = await interaction.followUp({ content: "🏓 Pinging..."});

        const botLatency = pm(msg.createdTimestamp - interaction.createdTimestamp)
        const shardLatency = pm(interaction.guild.shard.ping);
        
        const embed = new MessageEmbed()
          .setAuthor('🏓Pong!')
          .setColor('BLURPLE')
          .addFields({
              name: 'Interaction Latency:',
              value: `${botLatency}`,
              inline: true
            }, {
              name: `Shard | ${interaction.guild.shard.id} Latency:`,
              value: `${shardLatency}`,
              inline: true
            })
        await msg.edit({embeds: [embed]})
    },
});