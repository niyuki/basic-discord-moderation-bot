const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const { Command } = require('reconlx');
function getColor(index, x) {
    let color = colors[index].replace("<f>", x);
    return color;
}
const colors = [
    'rgba(240, 255, 0, <f>)',
    'rgba(147, 255, 0, <f>)',
    'rgba(0, 255, 4, <f>)',
    'rgba(0, 255, 182, <f>)',
    'rgba(0, 240, 255, <f>)',
    'rgba(0, 124, 255, <f>)',
    'rgba(81, 0, 255, <f>)',
    'rgba(182, 0, 255, <f>)',
    'rgba(255, 0, 220, <f>)',
    'rgba(255, 0, 85, <f>)',
]
module.exports = new Command({
    name: 'topvoices',
    description: 'See top voice ranking in your server',
    userPermissions: [''],
    run: async({client, interaction, args}) => {
        let embed = new MessageEmbed()
        .setAuthor({name :interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true })})
        .setFooter(`${interaction.guild.name} guilds voice stats`)
    let day = await tm.getDay(interaction.guild.id);
    embed.setDescription(`The voice activity of the users on the ${interaction.guild.name} server during the **${day}** day is listed in detail below.`);
    embed.setColor("2f3136");
    const x = 'minutes'
    Stat.aggregate([
        {$project: {Message: 0}},
        { $sort: { AllVoice: -1 } }
    ]).limit(10).exec(async (err, docs) => {
        if (err) throw err;
        let users = [], usersToEmbed = [];

        if (docs.length > 0) {
            for (let index = 0; index < docs.length; index++) {
                const doc = docs[index];
                let stat = doc;
                if (!stat) continue;

                if (stat.AllVoice <= 0) continue;

                if (stat.Voice) {
                    let days = Object.keys(stat.Voice);
                    let dataValues = new Array(day).fill(0);
                    days.forEach(_day => {
                        let sum = Object.values(stat.Voice[_day]).reduce((x, y) => x + y, 0);
                        dataValues[_day - 1] = (sum / (1000 * 60));
                    });
                    let user = (await client.users.fetch(doc.userID));
                    usersToEmbed.push({
                        User: user,
                        Value: dataValues.reduce((x, y) => x + y, 0)
                    });
                    let borderColors = new Array(dataValues.length).fill(getColor(index, "0.8"));
                    let backgroundColors = new Array(dataValues.length).fill(getColor(index, "0.1"))
                    let pointBackgroundColors = new Array(dataValues.length).fill(getColor(index, "1"));
                    let data = {
                        label: `${user.username}`,
                        data: dataValues,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        pointBackgroundColor: pointBackgroundColors,
                        borderWidth: 1.5,
                    };
                    users.push(data);
                }
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
                    datasets: users
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: '#ffffff',
                            fontSize: 20
                        }
                    }
                }
            });
            embed.addField(`Top 10 General Voice Stats`, '\`\`\`fix\n'+usersToEmbed.map((val, index) => `${index + 1}. ${val.User}(${val.User.username}): ${val.Value} ${x}`).join("\n")+'\n\`\`\`')
            embed.setImage("attachment://Graph.png");
            let attachment = new MessageAttachment(buffer, "Graph.png");
            const e = await interaction.followUp({content: 'Loading info'})
            e.edit({
                embeds: [embed],
                files: [attachment]
            });
        }
        else {
            embed.addField("No data found!", "** **");
            return message.csend(embed);
        }
    });
    },
});