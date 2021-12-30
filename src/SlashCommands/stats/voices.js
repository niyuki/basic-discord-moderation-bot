const { MessageEmbed, MessageAttachment } = require('discord.js');
const { Command } = require('reconlx');
const tm = require('../../events/timeM')
const cm = require('../../events/chartM')
const Stat = require('../../models/statschema')
const moment = require("moment");
require("moment-duration-format");

function convert(ms) {
    return (ms / (1000 * 60)).toFixed(0);
}
module.exports = new Command({
    name: 'voicestats',
    description: 'see voice stats of a user',
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

        const embed = new MessageEmbed().setTimestamp().setColor("RANDOM").setAuthor({name: user.username, iconURL: user.avatarURL({dynamic: true})}).setFooter(`${user.username}'s voice stats in ${interaction.guild.name}`)
        let data = await Stat.findOne({ userID: user.id }, {Voice : 0});
        if (!data) data = {};
    let day = await tm.getDay(interaction.guild.id);

    embed.setDescription(`The voice activity of ${user} during ${day} day is listed in detail below.`);
    embed.setColor("2f3136");

    let dataValue = new Array(day).fill(0);
    let dataDate = [];
    let dataColors = new Array(day).fill('rgba(0, 92, 210, 0.5)');

    if (data.Voice) {
        let dailyvoice = 0, weeklyvoice = 0, monthlyvoice = 0, totalvoice = 0;
        let days = Object.keys(data.Voice);

        let weekly = {}, monthly = {}, daily = [];

        days.forEach(_day => {
            let sum = Object.values(data.Voice[_day]).reduce((x, y) => x + y, 0);
            totalvoice += sum;
            dataValue[_day - 1] = convert(sum);
            dataColors.push('rgba(4, 255, 0, 0.5)');


            if (day == Number(_day)) {
                dailyvoice += sum;
                daily = Object.keys(data.Voice[_day]).map(e => Object.assign({ Channel: e, Value: data.Voice[_day][e] }));
            }
            if (_day <= 7) {
                weeklyvoice += sum;
                let keys = Object.keys(data.Voice[_day]);
                keys.forEach(key => {
                    if (weekly[key]) weekly[key] += data.Voice[_day][key];
                    else weekly[key] = data.Voice[_day][key];
                });
            }
            if (_day <= 30) {
                monthlyvoice += sum;
                let keys = Object.keys(data.Voice[_day]);
                keys.forEach(key => {
                    if (monthly[key]) monthly[key] += data.Voice[_day][key];
                    else monthly[key] = data.Voice[_day][key];
                });
            }
        });
        embed.addField("**Daily Voice Statistics**", '\`\`\`fix\n'+`
        Total: ${moment.duration(dailyvoice).format("H [hours, ] m [minutes]")}\n\n${daily.sort((x, y) => y.Value - x.Value).splice(0, 5).map((data, index) => {
            let channel = interaction.guild.channels.cache.get(data.Channel);
            return `${index + 1}. #${channel ? channel.name : "deleted-channel"}: ${moment.duration(data.Value).format("H [hours, ] m [minutes]")}`;
        }).join("\n")}\n\n
        `+'\`\`\`');

        embed.addField("**Weekly Voice Statistics**", '\`\`\`fix\n'+`
        Total: ${moment.duration(weeklyvoice).format("H [hours, ] m [minutes]")}\n\n${Object.keys(weekly).sort((x, y) => weekly[y] - weekly[x]).splice(0, 5).map((data, index) => {
            let channel = interaction.guild.channels.cache.get(data);
            return `${index + 1}. #${channel ? channel.name : "deleted-channel"}: ${moment.duration(weekly[data]).format("H [hours, ] m [minutes]")}`;
        }).join("\n")}\n\n
        `+'\`\`\`');

        embed.addField("**Monthly Voice Statistics**", '\`\`\`fix\n'+`
        Total: ${moment.duration(monthlyvoice).format("H [hours, ] m [minutes]")}\n\n${Object.keys(monthly).sort((x, y) => monthly[y] - monthly[x]).splice(0, 5).map((data, index) => {
            let channel = interaction.guild.channels.cache.get(data);
            return `${index + 1}. #${channel ? channel.name : "deleted-channel"}: ${moment.duration(monthly[data]).format("H [hours, ] m [minutes]")}`;
        }).join("\n")}\n\n
        `+'\`\`\`');

        embed.addField(`General Voice Statistics`, '\`\`\`fix\n'+`
        Total: ${moment.duration(totalvoice).format("H [hours, ] m [minutes]")}
        Daily: ${moment.duration(dailyvoice).format("H [hours, ] m [minutes]")}
        Weekly: ${moment.duration(weeklyvoice).format("H [hours, ] m [minutes]")}
        Monthly: ${moment.duration(monthlyvoice).format("H [hours, ] m [minutes]")}\n
        `+'\`\`\`', true)
    }
    else {
        embed.setDescription("No data found.");
    }

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
                label: "Total Voice Stats (Minutes)",
                data: [].concat(dataValue),
                backgroundColor: [
                    'rgba(4, 255, 0, 0.25)'
                ],
                borderColor: [].concat(dataColors),
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