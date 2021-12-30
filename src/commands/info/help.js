const client = require('../../index');
const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { readdirSync } = require('fs')
//prefix
const config = require('../../config.json')
const p = client.config.prefix
module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'Shows all available commands :flushed:',
    cooldown:20,
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
     run: async(client, message, args) => {
      const button0 = new MessageButton().setCustomId("main").setLabel('Main')
      const button1 = new MessageButton().setCustomId("commands").setLabel('Commands')
      const button2 = new MessageButton().setCustomId("slashcommands").setLabel('SlashCommands')

      const row = new MessageActionRow().addComponents([button0.setStyle("PRIMARY").setDisabled(true), button1.setStyle("SECONDARY").setDisabled(false), button2.setStyle("SECONDARY").setDisabled(false)])
      const row1 = new MessageActionRow().addComponents([button0.setStyle("SECONDARY").setDisabled(false), button1.setStyle("PRIMARY").setDisabled(true), button2.setStyle("SECONDARY").setDisabled(false)])
      const row2 = new MessageActionRow().addComponents([button0.setStyle("SECONDARY").setDisabled(false), button1.setStyle("SECONDARY").setDisabled(false), button2.setStyle("PRIMARY").setDisabled(true)])
        if(!args[0]) {     
            let categories = [];
            let x = "Missing Command Name!"
            readdirSync("./src/commands").forEach((dir) => {
                let array = (config.developer)

                if(dir == 'owner' && !array.includes(message.author.id.toString())) {
                    return
                }
                const commands = readdirSync(`./src/commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                const cmds = commands.map((command) => {
                    let file = require(`../../commands/${dir}/${command}`);

                    if (!file.name) return x

                    let name = file.name.replace(".js", "");
                    
                    return `\`${name}\``;
                });

                let data = new Object() ;

                data = {
                    name: dir.toUpperCase(),
                    value: cmds.length === 0 ? "-" : cmds.join(" "),
                };

                categories.push(data);
            });

            let categories2 = [];
            readdirSync("./src/SlashCommands").forEach((dir) => {
                let array = (config.developer)

                if(dir == 'owner' && !array.includes(message.author.id.toString())) {
                    return
                }
                const commands = readdirSync(`./src/SlashCommands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                const cmds = commands.map((command) => {
                    let file = require(`../../SlashCommands/${dir}/${command}`);

                    if (!file.name) return x

                    let name = file.name.replace(".js", "");
                    
                    return `\`${name}\``;
                });

                let data2 = new Object() ;

                data2 = {
                    name: dir.toUpperCase(),
                    value: cmds.length === 0 ? "-" : cmds.join(" "),
                };

                categories2.push(data2);
            });
            const helpembed = new MessageEmbed()
                  .setAuthor(message.guild.name)
                  .setThumbnail(message.guild.iconURL({dynamic: true}))
                  .setTitle("🥳 Hey Champ.. Do you need help? Anyways click below to see commands:")
                  .setDescription(`To get more addtional information on a command just type it after \`${p}help\`.\n Anyways hope you enjoy me... 😋`)
                  .addField('Prefix:', `\`${client.config.prefix}\``)
                  .addField('Links:', `[\`📩 ·  Invite Me\`](${`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`})\n[\`🎈 ·  Support Server\`](https://discord.gg/niyuki)\n[\`👨‍💻 ·  Bot Developer\`](https://niyuki.xyz)`)
                  .setColor(message.guild.members.cache.get(client.user.id).displayColor ||"BLURPLE")
                  .setTimestamp()
                  .setFooter('Use help <category>'+` | Developed by Niyuki`, message.author.avatarURL({dynamic: true}))
    

                const helpembed1 = new MessageEmbed()
                  .setAuthor(message.guild.name)
                  .setThumbnail(message.guild.iconURL({dynamic: true}))
                  .setTitle("🥳 Hey Champ.. Do you need help? Anyways here you can see all of my normal commands:")
                  .setDescription(`To get more addtional information on a command just type it after \`${p}help\`.\n Anyways hope you enjoy me... 😋`)
                  .addFields(categories)
                  .setColor(message.guild.members.cache.get(client.user.id).displayColor ||"BLURPLE")
                  .setTimestamp()
                  .setFooter(`Requested by ${message.author.tag}`+` | Developed by Niyuki`, message.author.avatarURL({dynamic: true}))
                
                const helpembed2 = new MessageEmbed()
                  .setAuthor(message.guild.name)
                  .setThumbnail(message.guild.iconURL({dynamic: true}))
                  .setTitle("🥳 Hey Champ.. Do you need help? Anyways here you can see all of my SlashCommands:")
                  .setDescription(`To get more addtional information on a command just type it after \`${p}help\`.\n Anyways hope you enjoy me... 😋`)
                  .addFields(categories2)
                  .setColor(message.guild.members.cache.get(client.user.id).displayColor ||"BLURPLE")
                  .setTimestamp()
                  .setFooter(`Requested by ${message.author.tag}`+` | Developed by Niyuki`, message.author.avatarURL({dynamic: true}))
        
                message.channel.send({embeds: [helpembed], components: [row]})
                const auth = message.author
              const filter = m => auth.id === message.author.id;

              const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

              collector.on('collect', async b => {
                if (!b.isButton()) return;
                if(b.customId == "commands") {
                  b.update({embeds: [helpembed1], components: [row1]})
                }
                if(b.customId == "slashcommands") {
                  b.update({embeds: [helpembed2], components: [row2]})
                }
                if(b.customId == "main") {
                  b.update({embeds: [helpembed], components: [row]})
                }             	
              });

        } else {
            const command =
              client.commands.get(args[0].toLowerCase()) ||
              client.commands.find(
                (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
              );
      
            if (!command) {
              const embed = new MessageEmbed()
                .setTitle(`Invalid command! Use \`${client.config.prefix}help\` for all of my commands!`)
                .setColor("BLURPLE");
              return message.channel.send({embeds: [embed]});
            }
      
            const embed = new MessageEmbed()
              .setTitle("Command Details:")
              .addField("PREFIX:", `\`${p}\``)
              .addField(
                "COMMAND:",
                command.name ? `\`${command.name}\`` : "No name for this command."
              )
              .addField(
                "ALIASES:",
                command.aliases
                  ? `\`${command.aliases.join("` `")}\``
                  : "No aliases for this command."
              )
              .addField(
                "USAGE:",
                command.usage
                  ? `\`${command.usage}\``
                  : `\`${p}${command.name}\``
              )
              .addField(
                "DESCRIPTION:",
                command.description
                  ? command.description
                  : "No description for this command."
              )
              .addField(
                "COOLDOWN:",
                command.cooldown
                  ? `\`${command.cooldown}\``
                  : `Dang enjoy because in this command you don't have any cooldowns kekw`
              )
              .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTimestamp()
              .setColor(message.guild.members.cache.get(client.user.id).displayColor || "BLURPLE");
            return message.channel.send({embeds: [embed]});
        }
    }
}