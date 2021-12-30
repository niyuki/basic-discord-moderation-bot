const client = require("../index");
const {MessageEmbed, Collection} = require('discord.js')
const Timeout = new Collection();
const ms = require('ms')

client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        if(cmd.cooldown) {
            if(Timeout.has(`slash-${cmd.name}-${interaction.user.id}`)) return interaction.followUp({embeds: [new MessageEmbed().setColor('4a0000').setAuthor(interaction.user.username, interaction.user.displayAvatarURL({dynamic:true})).setDescription(`You are on a \`${ms(Timeout.get(`slash-${cmd.name}-${interaction.user.id}`) - Date.now(), {long : true})}\` cooldown.`)]})
            if(!interaction.member.permissions.has(cmd.userPermissions || [])) return interaction.followUp({ content: "You do not have permission to use this command!"})
            if(!interaction.guild.me.permissions.has(cmd.botPermissions || [])) return interaction.followUp({ content: "I do not have permission to use this command!"})
            if(cmd.ownerOnly && !client.config.developer.includes(interaction.user.id.toString())) return interaction.followUp({content: 'Owner only command is not available for you.'})
            cmd.run({client, interaction, args});
            Timeout.set(`slash-${cmd.name}-${interaction.user.id}`, Date.now() + cmd.cooldown*1000)
            setTimeout(async() => {
                Timeout.delete(`slash-${cmd.name}-${interaction.user.id}`)
            }, cmd.cooldown*1000)
            if(client.channels.cache.get(client.config.commandlog)) client.channels.cache.get(client.config.commandlog).send({embeds: [new MessageEmbed()
                .setTitle(`${`Used Command: `} ${cmd.name}`)
                .setDescription(` ${interaction.user.tag} ${` user used the SlashCommand ${cmd.name}! Command was used in this channel: ${interaction.channel.name}`}`)
                .setColor('BLURPLE')
                .setFooter('🔥 Niyuki On Fire 🔥')]})
        } else {
            if(!interaction.member.permissions.has(cmd.userPermissions || [])) return interaction.followUp({ content: "You do not have permission to use this command!"})
            if(!interaction.guild.me.permissions.has(cmd.botPermissions || [])) return interaction.followUp({ content: "I do not have permission to use this command!"})
            if(cmd.ownerOnly && !client.config.developer.includes(interaction.user.id.toString())) return interaction.followUp({content: 'Owner only command is not available for you.'})
            cmd.run({client, interaction, args});
            if(client.channels.cache.get(client.config.commandlog)) client.channels.cache.get(client.config.commandlog).send({embeds: [new MessageEmbed()
                .setTitle(`${`Used Command: `} ${cmd.name}`)
                .setDescription(` ${interaction.user.tag} ${` user used the SlashCommand ${cmd.name}! Command was used in this channel: ${interaction.channel.name}`}`)
                .setColor('BLURPLE')
                .setFooter('🔥 Niyuki On Fire 🔥')]})
        }
    }

    // Context Menu Handling
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;
        if(!interaction.member.permissions.has(command.userPermissions || [])) return interaction.followUp({ content: "You do not have permission to use this command!"})
        if(!interaction.guild.me.permissions.has(command.botPermissions || [])) return interaction.followUp({ content: "I do not have permission to use this command!"})
        if(command.ownerOnly && !client.config.developer.includes(interaction.member.id.toString())) return interaction.followUp({content: 'Owner only command is not available for you.'})
        command.run(client, interaction);
        if(client.channels.cache.get(client.config.commandlog)) client.channels.cache.get(client.config.commandlog).send({embeds: [new MessageEmbed()
            .setTitle(`${`Used Command: `} ${command.name}`)
            .setDescription(` ${interaction.user.tag} ${` user used the SlashCommand ${command.name}! Command was used in this channel: ${interaction.channel.name}`}`)
            .setColor('BLURPLE')
            .setFooter('🔥 Niyuki On Fire 🔥')]})
    }
});
