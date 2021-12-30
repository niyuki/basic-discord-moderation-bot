const { MessageEmbed, MessageAttachment } = require('discord.js');
const { Command } = require('reconlx');
const tm = require('../../events/timeM')
const cm = require('../../events/chartM')
const Stat = require('../../models/statschema')
const moment = require("moment");
require("moment-duration-format");
module.exports = new Command({
    name: 'stat',
    description: 'see stats of a user',
    userPermissions: [''],
    options: [
        {
            name: 'target',
            description: 'target to see all stats',
            type: 'USER',
        }
    ],
    run: async({client, interaction, args}) => {
        const user = interaction.options.getUser("target") || interaction.user;

        const embed = new MessageEmbed().setTimestamp().setColor("RANDOM").setAuthor({name: user.username, iconURL: user.avatarURL({dynamic: true})}).setFooter('Statistics information')
        let data = await Stat.findOne({ userID: user.id });
        if (!data) data = {};
    let day = await tm.getDay(interaction.guild.id);

    let dataMessage = new Array(day).fill(0, 0, day), dataVoice = new Array(day).fill(0, 0, day), dataColors = new Array(day).fill('rgba(0, 92, 210, 0.5)');

    if (data.Message) {
        let dailymessage = 0, weeklymessage = 0, monthlymessage = 0, totalmessage = 0;
        let days = Object.keys(data.Message);
        days.forEach(_day => {
            let sum = Object.values(data.Message[_day]).reduce((x, y) => x + y, 0);
            totalmessage += sum;
            dataMessage[_day - 1] = sum;
            if (day == Number(_day)) dailymessage += sum;
            if (_day <= 7) weeklymessage += sum;
            if (_day <= 30) monthlymessage += sum;
        });
        embed.addField(`Message Stats`, 
        '\`\`\`fix\n'+`
        Total: ${totalmessage} messages\n\nDaily: ${dailymessage} messages\n\nWeekly: ${weeklymessage} messages\n\nMonthly: ${monthlymessage} messages
        `+'\n\`\`\`', true)
    }
    if (data.Voice) {
        let dailyvoice = 0, weeklyvoice = 0, monthlyvoice = 0, totalvoice = 0;
        let days = Object.keys(data.Voice);
        let max = Math.max(dataMessage);
        days.forEach(_day => {
            let sum = Object.values(data.Voice[_day]).reduce((x, y) => x + y, 0);
            if (isNaN(sum)) sum = 0;
            totalvoice += sum;

            dataVoice[_day - 1] = (sum / (1000 * 60))
            if (day == Number(_day)) dailyvoice += sum;
            if (_day <= 7) weeklyvoice += sum;
            if (_day <= 30) monthlyvoice += sum;
        });
        embed.addField(`Voice Stats`,
        '\`\`\`fix\n'+`
        Total: ${moment.duration(totalvoice).format("H [hours, ] m [minutes]")}\n\nDaily: ${moment.duration(dailyvoice).format("H [hours, ] m [minutes]")}\n\nWeekly: ${moment.duration(weeklyvoice).format("H [hours, ] m [minutes]")}\n\nMonthly: ${moment.duration(monthlyvoice).format("H [hours, ] m [minutes]")}
        `+'\n\`\`\`', true)
    }

    let dataDate = [];
    for (let index = 0; index < day; index++) {
        let date = new Date(Date.now() - (1000 * 60 * 60 * 24 * (day - (index + 1))));
        dataDate.push(date.toLocaleDateString());
    }

    let buffer = await cm.ImageFromData({
        width: 600,
        height: 290,
        type: 'line',

        data: {
            labels: [].concat(dataDate),
            datasets: [{
                label: "Total Message Stats (Amount)",
                data: [].concat(dataMessage),
                backgroundColor: [
                    'rgba(0, 112, 255, 0.25)'
                ],
                borderColor: [].concat(dataColors),
                borderWidth: 1
            },
            {
                label: "Total Voice Stats (Minutes)",
                data: dataVoice,
                backgroundColor: [
                    'rgba(4, 255, 0, 0.25)'
                ],
                borderColor: [].concat(new Array(day).fill('rgba(4, 255, 0, 0.5)')),
                borderWidth: 1
            }]
        },
        options: {

        }
    });

    embed.setImage("attachment://Graph.png");
    let attachment = new MessageAttachment(buffer, "Graph.png");
    const e = await interaction.followUp({content: 'Loading info'})
    e.edit({
        embeds: [embed],
        files: [attachment]
    });
    },
});