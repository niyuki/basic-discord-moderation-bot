const {VoiceState, Collection} = require("discord.js");
const Settings = require("../config.json")

const Stat = require("../models/statschema");
const client = require('../index.js')
const Voices = client.Voices = new Collection();
const tm = require('./timeM')

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */
client.on('voiceStateUpdate', async(oldState, newState) => {
    if(oldState.member.user.bot) return;

    if(!oldState.channelID && newState.channelID && !Settings.Stats.Voice.ignoreChannels.includes(newState.channelID)){
        return Voices.set(oldState.id, {
            Time: Date.now(),
            ChannelID: newState.channelID
        });
    }

    if(!Voices.has(oldState.id) && !Settings.Stats.Voice.ignoreChannels.includes(newState.channelID)) Voices.set(oldState.id, {
        Time: Date.now(),
        ChannelID: (oldState.channelID || newState.channelID)
    });

    if(oldState.channelID && newState.channelID && !Settings.Stats.Voice.ignoreChannels.includes(newState.channelID)){
        let data = Voices.get(oldState.id);
        Voices.set(oldState.id, {
            Time: Date.now(),
            ChannelID: newState.channelID
        });

        let duration = Date.now() - data.Time;
        return await Stat.findOneAndUpdate({ userID: oldState.id }, { $inc: { AllVoice: duration, [`Voice.${await tm.getDay(Settings.guildId)}.${data.ChannelID}`]: duration } }, { upsert: true }).exec();
    }
	
    else if(oldState.channelID && !newState.channelID && !Settings.Stats.Voice.ignoreChannels.includes(oldState.channelID)){
        let data = Voices.get(oldState.id);
        Voices.delete(oldState.id);
        let duration = Date.now() - data.Time;
        return await Stat.findOneAndUpdate({ userID: oldState.id }, { $inc: { AllVoice: duration, [`Voice.${await tm.getDay(Settings.guildId)}.${data.ChannelID}`]: duration } }, { upsert: true }).exec();
    }
});