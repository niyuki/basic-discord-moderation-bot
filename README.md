# Setup

<ul>
  <p><code>1.</code> After downloading this project head to the console and type <code>npm i</code></p>
  <p><code>2.</code> After setting up all modules go to <code>config.json</code> and fill the things like on the example below.</p>
  <p><code>3.</code> If you finished all ttype in console <code>node src/index.js</code> to run the bot.</p>
</ul>
<h3>Congratulations 🎉</h3>

# Example Settings File

```json
{
    "token": "TOKEN",
    "prefix": ".",
    "mongooseConnectionString": "MONGO_CONNECTION",
    "developer": ["YoUR_id"],
    "commandlog": "COMMAnD_LOGCHANNEL_ID",
    "invitelog": "INVITE_LOGCHANNEL_ID",
    "guildId": "GUILD_ID",
    "ChatGuard": {
        "logchannel": "CHATGUARD_LOGCHANNEL_ID"
    },
    "Welcome": {
        "channel": "WELCOME_CHANNEL_ID",
        "role": "AUTOROLE_ID"
    },
    "Jail": {
        "roles": ["JAILED_ROLE_ID1","JAILED_ROLE_ID2"],
        "authorized": "JAIL_HAMMER_ROLE_ID"
    },
    "Stats": {
        "Message":{
            "ignoreChannels": ["EXAMPLE_MESSAGECHANNEL_TOSKIP_1","EXAMPLE_MESSAGECHANNEL_TOSKIP_2"],
            "Cooldown": 1
        },
        "Voice": {
            "ignoreChannels": ["EXAMPLE_VOICE_TOSKIP_1", "EXAMPLE_VOICE_TOSKIP_2"]
        }
    },
    "ContextTimeouts": {
        "BannedContentTimeout": "30m",
        "WrongChannelTimeout": "15m",
        "disturbChannelTimeout": "15m",
        "provokingTimeout": "15m",
        "blackmailTimeout": "3h",
        "blackmailJail": "7d",
        "disrespectTimeout": "3h",
        "disrespectJail": "2w",
        "hammers": {
            "banRole": "BAN_HAMMER_ROLE_ID",
            "timeoutRole": "TIMEOUT_HAMMER_ROLE_ID"
        }
    }
}
```

# ATTENTION!
<h3>This project was officially made by <a href="https://discord.com/users/730448609790787585">Niyuki <a href="https://discord.gg/serendia/"> </a>Feel free to contact me if you hit on any errors because it might have some issues.It's prohibited from changing and sharing on behalf of other server/person!</h3>

<p align="center">
  <a href="https://discord.gg/QXghTbvpGU"><img src="https://img.shields.io/badge/Serendia%20Squad%20-006400.svg?&style=for-the-badge&logo=discord&logoColor=white"></a>
  <a href="https://discord.com/users/730448609790787585"><img src="https://img.shields.io/badge/Niyuki%20-808080.svg?&style=for-the-badge&logo=discord&logoColor=white"></a>
  <a href="https://github.com/niyuki"><img src="https://img.shields.io/badge/Github%20-1d202b.svg?&style=for-the-badge&logo=github&logoColor=white"></a>
    <a href="https://npmjs.com/package/niyuki-cli"><img src="https://img.shields.io/badge/My%20Own%20NPM%20Package%20-ff2050.svg?&style=for-the-badge&logo=npm&logoColor=white"></a>
</p>
