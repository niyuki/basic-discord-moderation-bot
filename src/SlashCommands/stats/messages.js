const { MessageEmbed, MessageAttachment } = require('discord.js');
const { Command } = require('reconlx');
const tm = require('../../events/timeM')
const cm = require('../../events/chartM')
const Stat = require('../../models/statschema')
const moment = require("moment");
require("moment-duration-format");
module.exports = new Command({
    name: 'messagestats',
    description: 'see message stats of a user',
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

        const embed = new MessageEmbed().setTimestamp().setColor("RANDOM").setAuthor({name: user.username, iconURL: user.avatarURL({dynamic: true})}).setFooter(`${user.username}'s message stats in ${interaction.guild.name}`)
        let data = await Stat.findOne({ userID: user.id }, {Voice : 0});
        if (!data) data = {};
    let day = await tm.getDay(interaction.guild.id);

    embed.setDescription(`The message activity of ${user} during ${day} day is listed in detail below.`);
    embed.setColor("2f3136");

    let dataValue = new Array(day).fill(0);
    let dataDate = [];
    let dataColors = new Array(day).fill('rgba(0, 92, 210, 0.5)');

    if (data.Message) {
        let dailymessage = 0, weeklymessage = 0, monthlymessage = 0, totalmessage = 0;
        let days = Object.keys(data.Message);

        let weekly = {}, monthly = {}, daily = [];

        days.forEach(_day => {
            let sum = Object.values(data.Message[_day]).reduce((x, y) => x + y, 0);
            totalmessage += sum;
            dataValue[_day - 1] = sum;

            if (day == Number(_day)) {
                dailymessage += sum;
                daily = Object.keys(data.Message[_day]).map(e => Object.assign({ Channel: e, Value: data.Message[_day][e] }));
            }
            if (_day <= 7) {
                weeklymessage += sum;
                let keys = Object.keys(data.Message[_day]);
                keys.forEach(key => {
                    if (weekly[key]) weekly[key] += data.Message[_day][key];
                    else weekly[key] = data.Message[_day][key];
                });
            }
            if (_day <= 30) {
                monthlymessage += sum;
                let keys = Object.keys(data.Message[_day]);
                keys.forEach(key => {
                    if (monthly[key]) monthly[key] += data.Message[_day][key];
                    else monthly[key] = data.Message[_day][key];
                });
            }
        });
        embed.addField("**Daily Message Statistics**", '\`\`\`fix\n'+`
        Total: ${dailymessage} message\n\n${daily.sort((x, y) => y.Value - x.Value).splice(0, 5).map((data, index) => {
            let channel = interaction.guild.channels.cache.get(data.Channel);
            return `${index + 1}. ${channel ? channel.name : "deleted-channel"}: ${data.Value} message`;
        }).join("\n")}\n\n
        `+'\`\`\`');

        embed.addField("**Weekly Message Statistics**", '\`\`\`fix\n'+`
        Total: ${weeklymessage} message\n\n${Object.keys(weekly).sort((x, y) => weekly[y] - weekly[x]).splice(0, 5).map((data, index) => {
            let channel = interaction.guild.channels.cache.get(data);
            return `${index + 1}. ${channel ? channel.name : "deleted-channel"}: ${weekly[data]} message`;
        }).join("\n")}\n\n
        `+'\`\`\`');

        embed.addField("**Monthly Message Statistics**", '\`\`\`fix\n'+`
        Total: ${weeklymessage} message\n\n${Object.keys(monthly).sort((x, y) => monthly[y] - monthly[x]).splice(0, 5).map((data, index) => {
            let channel = interaction.guild.channels.cache.get(data);
            return `${index + 1}. ${channel ? channel.name : "deleted-channel"}: ${monthly[data]} message`;
        }).join("\n")}\n\n
        `+'\`\`\`');

        embed.addField(`General Message Statistics`, '\`\`\`fix\n'+`
        Total: ${totalmessage} message\nDaily: ${dailymessage} message\nWeekly: ${weeklymessage} message\nMonthly: ${monthlymessage} message
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
                label: "Total Message Stats (Amount)",
                data: [].concat(dataValue),
                backgroundColor: [
                    'rgba(0, 112, 255, 0.25)'
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