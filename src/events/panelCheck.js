const client = require('../index')
const conf = require('../config.json')
const penals = require('../models/jailSchema')
client.on('ready', async() => {
    setInterval(async () => {
        const guild = client.guilds.cache.get(conf.guildId);
        if (!guild) return;
        const activePenals = await penals.find({ });
        activePenals.forEach(async (x) => {
            const msg = `Looks like your jail expired from ${guild} so I gave your old roles. You should thank him OwO`
            console.log(x.timestamp+'+'+x.duration+'>'+Date.now())
            if((x.timestamp+x.duration) < Date.now() ) {
                const user = guild.members.cache.get(x.userID);
                if(!x.oldRoles.some(a => user.roles.cache.get(a))) user.roles.set(x.oldRoles).then(() => user.send({ content: msg}).catch(console.log))
            
                await penals.findOneAndDelete({ userID: x.userID })
            }
        });
      }, 1000 * 5);
})