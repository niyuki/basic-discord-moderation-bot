const Settings = require("../config.json");
const Stat = require("../models/statschema");
const client = require("../index.js");
const tm = require('./timeM')
client.on('ready', async() => {
    let guild = client.guilds.cache.get(Settings.guildId);
    if(!guild) return;
    
    let channels = guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE" && channel.members.size > 0 && !Settings.Stats.Voice.ignoreChannels.includes(channel.id));
    channels.forEach(channel => {
        let members = channel.members.filter(member => !member.user.bot);
        members.forEach(member => {
            client.Voices.set(member.id, {
                ChannelID: channel.id,
                Time: Date.now()
            });
        });
    });

    setInterval(() => {
        check();
    }, 30000);
})    

function check(){
    let voices = client.Voices;
    voices.each(async(value, key) => {
        voices.set(key, {
            ChannelID: value.ChannelID,
            Time: Date.now()
        });
        await Stat.findOneAndUpdate({ userID: key }, { $inc: { AllVoice: Date.now() - value.Time, [`Voice.${await tm.getDay(Settings.guildId)}.${value.ChannelID}`]: Date.now()-value.Time } }, { upsert: true }).exec();
    });
}