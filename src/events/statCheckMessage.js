const {Message} = require("discord.js");
const Settings = require("../config.json");
const Stat = require("../models/statschema");
const client = require("../index.js")
const cooldowns = new Map();
const tm = require('./timeM')
/**
 * @param {Message} message 
 */
client.on('messageCreate', async(message) => {
    if(message.author.bot || message.channel.type != "GUILD_TEXT" || Settings.Stats.Message.ignoreChannels.includes(message.channel.id)) return;
    if(cooldowns.has(message.author.id)){
        let data = cooldowns.get(message.author.id);

        let timePass = Date.now() - data.Time;
        if((timePass / 1000) < Settings.Stats.Message.Cooldown) return;
    }

    await Stat.findOneAndUpdate({ userID: message.author.id }, { $inc: { AllMessage: 1, [`Message.${await tm.getDay(Settings.guildId)}.${message.channel.id}`]: 1 } }, { upsert: true }).exec();    
    cooldowns.set(message.author.id, {
        Time: Date.now()
    });
});
