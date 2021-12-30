const Guild = require("../models/guildschema");

class TimeManager {
    static async getDay(id) {
        let x = await Guild.findOne({ guildID: id }).exec().then((doc) => {
            if (!doc) {
                new Guild({ guildID: id, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) }).save();
                return 1;
            }
            else {
                return doc.Day;
            }
        });
        return x;
    }

    static async setToday(id) {
        await Guild.updateOne({ guildID: id }, { $set: { Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) } }, { upsert: true }).exec();
    }

    static async addDay(id, value) {
        await Guild.updateOne({ guildID: id }, { $inc: { Day: value } }, { upsert: true, setDefaultsOnInsert: true }).exec((err, doc) => {
            if (err) console.error(err);
        });
    }
    static async sumDay(id, value) {
        await Guild.updateOne({ guildID: id }, { $inc: { Day: -value } }, { upsert: true, setDefaultsOnInsert: true }).exec((err, doc) => {
            if (err) console.error(err);
        });
    }

    static async checkDay(id) {
        let data = await Guild.findOne({ guildID: id }).exec();
        if (!data) return new Guild({ guildID: id, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) }).save();
        if (data.NextUpdate < Date.now()) {
            data.NextUpdate = new Date().setHours(24, 0, 0, 0);
            data.Day += 1;
        }
        data.save();
    }
}

module.exports = TimeManager;