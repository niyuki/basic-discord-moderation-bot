const client = require('../index')
const { MessageEmbed } = require('discord.js')
const chatModel = require('../models/chatGSchema');
const { Spam, BadWord, WhiteList, Punish } = require('./chatM');
 
client.on('messageCreate', async (message) => {
    if(!message.guild || message.author.bot || message.member.permissions.has(["ADMINISTRATOR"]) || message.author.id === message.guild.ownerId) return;
     const Database = await chatModel.findOne({ ServerID: message.guild.id });
     if(!Database || await WhiteList(message) === true) return;
     const Embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor({name :message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })});
 
     if(message.content.length > '500') { 
         if(Database.CharacterLimit === false || Database.CharacterLimit === null || !Database.CharacterLimit) return;
         if (message && message.deletable) message.delete().catch(() => {});
         return await Punish(message, 'CharacterLimit', Embed);
     }
     if(message.mentions.users.size >= 10) { 
         if(Database.MassPingGuard === false || Database.MassPingGuard === null || !Database.MassPingGuard) return;
         if (message && message.deletable) message.delete().catch(() => {});
         return await Punish(message, 'MassPingGuard', Embed);
     }
 
     if(await Spam(message) === true ) {
         if(Database.SpamGuard === false || Database.SpamGuard === null || !Database.SpamGuard) return;
         if (message && message.deletable) message.delete().catch(() => {});
         return await Punish(message, 'SpamGuard', Embed);
     }
     
     let InviteGuardReg = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?pp?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/;  
     if (InviteGuardReg.test(message.content)){
         if(Database.InviteGuard === false || Database.InviteGuard === null || !Database.InviteGuard) return;
         if (message && message.deletable) message.delete().catch(() => {});
         return await Punish(message, 'InviteGuard', Embed);
     }
    
     let LinkGuardReg = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
     if (LinkGuardReg.test(message.content)){
         if(Database.LinkGuard === false || Database.LinkGuard === null || !Database.LinkGuard) return;
         if (message && message.deletable) message.delete().catch(() => {});
         return message.channel.send({ embeds: [Embed.setDescription('<@'+message.author.id+'>, You are prohibited from using messages containing links !')]}).then(x => setTimeout(async() => { x.delete()}, 3000)).catch(() => {});
     }
     if(BadWord(message.content) === true) { 
         if(Database.BadWordGuard === false || Database.BadWordGuard === null || !Database.BadWordGuard) return;
         if (message && message.deletable) message.delete().catch(() => {});
         return //message.channel.send({ embeds: [Embed.setDescription('<@'+message.author.id+'>, You\'re not allowed to use slanderous messages !')]}).then(x => setTimeout(async() => { x.delete()}, 3000)).catch(() => {});
     }
    
     if (Database && Database.FiltredWords.some(Word => ` ${message.content.toLowerCase()} `.includes(` ${Word} `)) === true) {
      if (message && message.deletable) message.delete().catch(() => {});
      return message.channel.send({ embeds: [Embed.setDescription('<@'+message.author.id+'>, You are prohibited from using messages with filtered words !')]}).then(x => setTimeout(async() => { x.delete()}, 3000)).catch(() => {});
     }
 });

 client.on('messageUpdate', async (oldMessage, newMessage) => {
    if(!newMessage.guild || newMessage.author.bot || newMessage.member.permissions.has(["ADMINISTRATOR"]) || newMessage.author.id === newMessage.guild.ownerId) return;
     const Database = await chatModel.findOne({ ServerID: newMessage.guild.id });
     if(!Database || await WhiteList(newMessage) === true) return;
     const Embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setAuthor(newMessage.guild.name, newMessage.guild.iconURL({ dynamic: true }));
 
     if(newMessage.content.length > '500') { 
         if(Database.CharacterLimit === false || Database.CharacterLimit === null || !Database.CharacterLimit) return;
         if (newMessage && newMessage.deletable) newMessage.delete().catch(() => {});
         return await Punish(newMessage, 'CharacterLimit', Embed);
     }

     let InviteGuardReg = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?pp?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/;  
     if (InviteGuardReg.test(newMessage.content)){
         if(Database.InviteGuard === false || Database.InviteGuard === null || !Database.InviteGuard) return;
         if (newMessage && newMessage.deletable) newMessage.delete().catch(() => {});
         return await Punish(newMessage, 'InviteGuard', Embed);
     }
    
     let LinkGuardReg = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
     if (LinkGuardReg.test(newMessage.content)){
         if(Database.LinkGuard === false || Database.LinkGuard === null || !Database.LinkGuard) return;
         if (newMessage && newMessage.deletable) newMessage.delete().catch(() => {});
         return newMessage.channel.send({ embeds: [Embed.setDescription('<@'+newMessage.author.id+'>, You are prohibited from using messages containing links !')]}).then(x => x.delete({timeout: 3000})).catch(() => {});
     }
     if(BadWord(newMessage.content) === true) { 
         if(Database.BadWordGuard === false || Database.BadWordGuard === null || !Database.BadWordGuard) return;
         if (newMessage && newMessage.deletable) newMessage.delete().catch(() => {});
         return newMessage.channel.send({ embeds: [Embed.setDescription('<@'+newMessage.author.id+'>, You\'re not allowed to use slanderous messages !')]}).then(x => x.delete({timeout: 3000})).catch(() => {});
     }
    
    if (Database && Database.FiltredWords.some(Word => ` ${newMessage.content.toLowerCase()} `.includes(` ${Word} `)) === true) {
     if (newMessage && newMessage.deletable) newMessage.delete().catch(() => {});
     return newMessage.channel.send({ embeds: [Embed.setDescription('<@'+newMessage.author.id+'>, You are prohibited from using messages with filtered words !')]}).then(x => x.delete({timeout: 3000})).catch(() => {});
    }
 });