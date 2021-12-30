const { Command } = require('reconlx')
const { Client, MessageActionRow, MessageSelectMenu } = require('discord.js')
const warnModel = require('../../models/warnSchema');
const jailModel = require('../../models/jailSchema');
const config = require('../../config.json')
const moment = require('moment')
const ms = require('ms')
module.exports = new Command({
    name: 'jail',
    description: 'jail member',
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name: 'target',
            description: 'target to jail',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'reason to jail',
            type: 'STRING',
        },
        {
            name: 'duration',
            description: 'duration to jail',
            type: 'STRING',
        },
    ],
    run: async({client, interaction, args}) => {
        const endedmsg = 'Jail reason selection got cancelled due to inactivity.'
        if(!interaction.member.roles.cache.get(config.Jail.authorized)) return;
        const member = interaction.options.getMember('target');
        const durationif = interaction.options.getString("length")
        const reasonif = interaction.options.getString("reason")
        if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ content: 'You can not take action on this user as their role is heigher than yours'});
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({content: 'I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.', ephemeral: true})

        if (member.id === interaction.guild.ownerId) return interaction.followUp({content: 'I cannot warn the owner of the server.', ephemeral: true})

        if (member.id === interaction.user.id) return interaction.followUp({content: 'You cannot warn yourself.', ephemeral: true})

        if (member.id === interaction.guild.me.id) return interaction.followUp({content: 'I cannot warn myself.', ephemeral: true})
        let reason, duration;
        if(durationif) {
            let roles = [];
            member.roles.cache.filter(a => a.name !== '@everyone').map(a => roles.push(a.id))
            reason = reasonif || 'No valid reason provided please ask moderator.'
            duration = ms(durationif);
            if(!duration) return interaction.followUp({ content: 'Please specify a valid duration!'});
            await member.roles.set(config.Jail.roles)
            await member.send(`You have been jailed by **${interaction.user.username}**(\`${interaction.user.id}\`), reason: ${reason}. I'm sorry 😥`).catch(console.log)
            await new jailModel({
                userID: member.id,
                moderatorID: interaction.user.id,
                timestamp: Date.now(),
                reason: reason,
                oldRoles: roles,
                duration: duration,
            }).save();
              await new warnModel({
                  userID: member.id,
                  guildID: interaction.guildId,
                  moderatorID: interaction.user.id,
                  reason: `Jail: ${reason} until ${moment(Date.now()+duration)}`,
                  timestamp: Date.now()
              }).save();
              
            
            interaction.followUp({content: `Jailed **${member.user.username}** succesfully! Reason: ${reason} until ${moment(Date.now()+duration)}(\`${moment(Date.now()+duration).fromNow()}\`) `})
      
        } else {
            const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('jailreason').addOptions([
                {
                    label: `Blackmailing staff.`,
                    description: `Let him take some fresh air for like **14 days(2 Weejs)**`,
                    value: "1",
                },
                {
                    label: `Posting unappropiate media in specific channels`,
                    description: `I think **7 days(1 Week)** would be enough to take this under control.`,
                    value: "2",
                },
                {
                    label: `Talking Religion/Races`,
                    description: `Seeing no tolerance into talking about religion/races so I'd give **37 days(1 Month & 1 Week)**.`,
                    value: "3",
                },
                {
                    label: `Talking politics and swearing at society`,
                    description: `Seeing no tolerance at talking religion/races and this so I'd also give **37 days(1 Month+1Week)**`,
                    value: "4",
                },
                {
                    label: `Trolling or Raiding the server`,
                    description: `Tbh its a ban but I will keep **30 days(1 Month)** just to make sure they will calm down`,
                    value: "5",
                },
                {
                    label: `Corrupting server layout or rules.`,
                    description: `In **21 days(3 Weeks)** the rules should be re-readable so no rules go corrupted huh.`,
                    value: "6",
                },
                
            ]).setPlaceholder('Please select below the reason for this jail so I can make durations on my own'))
        const msg = await interaction.followUp({ content:'Please select below the reason for this jail so I can make durations on my own', components: [row]})
        const roles = [];
        console.log(member.roles.cache.filter(a => a.name !== '@everyone').map(a => a.id))
        const filter = i => i.user.id === interaction.member.id;
        //create collector for channel
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
        //collecting interaction button and menu
        collector.on('collect', async b => {
            if(b.customId !== 'jailreason') return;
          switch (b.values[0]) {
              case "1":
                  reason = `Blackmailing staff.`;
                  duration = ms("14 days")
                break;
                case "2":
                    reason = `Posting unappropiate media in specific channels`;
                    duration = ms("7 days")
                    break;
                    case "3":
                        reason = `Talking Religion/Races`;
                        duration = ms("37 days")
                        break;
                        case "4":
                            reason = `Talking politics and swearing at society`;
                            duration = ms("37 days")
                            break;
                            case "5":
                                reason = `Trolling or Raiding the server`;
                                duration = ms("30 days")
                                break;
                                case "6":
                                    reason = `Corrupting server layout or rules.`;
                                    duration = ms("21 days")
                                    break;
              default:
                    reason = reasonif || 'No valid reason provided please ask moderator.'
                    duration = ms(durationif);
                    if(!duration) return interaction.followUp({ content: 'Please specify a valid duration!'});
                    break;
          }
          await member.roles.set(config.Jail.roles)
          await member.send(`You have been jailed by **${interaction.user.username}**(\`${interaction.user.id}\`), reason: ${reason}. I'm sorry 😥`).catch(console.log)
          await new jailModel({
            userID: member.id,
            moderatorID: interaction.user.id,
            timestamp: Date.now(),
            reason: reason,
            oldRoles: roles,
            duration: duration,
        }).save();
          await new warnModel({
              userID: member.id,
              guildID: interaction.guildId,
              moderatorID: interaction.user.id,
              reason: `Jail: ${reason} until ${moment(Date.now()+duration)}`,
              timestamp: Date.now()
          }).save();
          
          b.update({content: `Jailed **${member.user.username}** succesfully! Reason: ${reason} until ${moment(Date.now()+duration)}(\`${moment(Date.now()+duration).fromNow()}\`) `, components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('aksdlandk').setPlaceholder('Thanks for keeping the server safe!').addOptions({ label: 'Yes I know', value: 'alksdnalskdns'}))]})
    
        });

        collector.on('end', () => {
            msg.edit({ content: endedmsg, components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('aksdlandk').setPlaceholder('Thanks for keeping the server safe!').addOptions({ label: 'Yes I know', value: 'alksdnalskdns'}))]})
        })
        }
      }
})