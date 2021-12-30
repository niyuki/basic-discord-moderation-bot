const { MessageEmbed, MessageAttachment } = require('discord.js');
const { Command } = require('reconlx');
const tm = require('../../events/timeM')
const cm = require('../../events/chartM')
const Stat = require('../../models/statschema')
const moment = require("moment");
require("moment-duration-format");
const config = require('../../config.json')
module.exports = new Command({
    name: 'reset-stat',
    description: 'reset stats of message/voice/both',
    userPermissions: [''],
    options: [
        {
            name: 'message',
            description: 'Reset message stats',
            type: 'SUB_COMMAND',
        },
        {
            name: 'voice',
            description: 'Reset voice stats',
            type: 'SUB_COMMAND',
        },
        {
            name: 'all',
            description: 'Reset all stats',
            type: 'SUB_COMMAND',
        },
    ],
    run: async({client, interaction, args}) => {
        if(!config.developer.includes(interaction.user.id)) return;
        const user = interaction.user
        await tm.setToday(interaction.guild.id);
        switch(interaction.options.getSubcommand()) {
            case 'voice': {
                if (undefined) return Stat.findOneAndUpdate({ userID: undefined }, { $set: { "Voice": {} } }).exec((err) => { if (err) console.error(err) });
                await Stat.updateMany({ Voice: { $exists: true } }, { $set: { "Voice": {} } }, { multi: true }).exec();
                const embed = new MessageEmbed().setDescription(`All Voice Statistics was reset by ${interaction.member}`).setTimestamp().setColor("RANDOM").setAuthor({name: user.username, iconURL: user.avatarURL({dynamic: true})}).setFooter('Statistics information')
                return interaction.followUp({ embeds: [embed]})
            }
            case 'message': {
                if (undefined) return Stat.findOneAndUpdate({ userID: undefined }, { $set: { "Message": {} } }).exec((err) => { if (err) console.error(err) });
                await Stat.updateMany({ Message: { $exists: true } }, { $set: { "Message": {} } }, { multi: true }).exec();
                const embed = new MessageEmbed().setDescription(`All Message Statistics was reset by ${interaction.member}`).setTimestamp().setColor("RANDOM").setAuthor({name: user.username, iconURL: user.avatarURL({dynamic: true})}).setFooter('Statistics information')
                return interaction.followUp({ embeds: [embed]})
            }
            case 'all': {
                if (undefined) return Stat.findOneAndUpdate({ userID: undefined }, { $set: { "Message": {} }}, { $set: { "Voice": {} } }).exec((err) => { if (err) console.error(err) });
                await Stat.updateMany({}, { $set: { AllVoice: 0, AllMessage: 0 } }).exec();
                await Stat.updateMany({ Voice: { $exists: true } }, { $set: { "Voice": {} } }, { multi: true }).exec();
                await Stat.updateMany({ Message: { $exists: true } }, { $set: { "Message": {} } }, { multi: true }).exec();
                const embed = new MessageEmbed().setDescription(`All Statistics was reset by ${interaction.member}`).setTimestamp().setColor("RANDOM").setAuthor({name: user.username, iconURL: user.avatarURL({dynamic: true})}).setFooter('Statistics information')
                return interaction.followUp({ embeds: [embed]})
            }
        }

        
    },
});