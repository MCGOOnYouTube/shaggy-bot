const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = `shaggy`;
const token = 'NzMzMzYyOTg3NTUyNzM1MzIz.XxCDgQ.mbhghhFvxcDhj8NweK9yPzjz8qo';
const date = new Date();

const db = require('quick.db')

bot.on('ready', () => {
    console.log(`${bot.user.tag} successfully logged in!`)
    bot.user.setActivity('life', ({type: "PLAYING"}))
})

bot.on('guildBanAdd', (guild, user) => {
    bot.channels.fetch('733364673516273707').then(c => {
        c.send(`Welcome ${user}! To get a list of commands, use the command \`shaggy help\`. *Only works if you have DMs from Server toggled.*`)
    })
})

bot.on('userUpdate', (user) => {
    console.log(user.username)
})

bot.on('message', message => {

    if (message.guild != null) {
        db.add(`guildMessages_${message.guild.id}_${message.author.id}`, 1)
        let usersMessages = db.fetch(`guildMessages_${message.guild.id}_${message.author.id}`)
        if (!message.member.roles.cache.has('739624143871279134') && usersMessages >= 50) {
            message.member.roles.add('739624143871279134')
        }
        if (!message.member.roles.cache.has('739623781571756075') && usersMessages >= 200) {
            message.member.roles.add('739623781571756075')
        }    
        if (!message.member.roles.cache.has('739623229013885020') && usersMessages >= 500) {
            message.member.roles.add('739623229013885020')
        }
    }

    if (!message.content.startsWith(prefix)) return;

    const arguments = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = arguments.shift().toLowerCase();

    if(command === `rasengan`){
        if (!message.member.hasPermission('BAN_MEMBERS')) return noPerms(message)
        if (message.mentions.users.first() && message.mentions.members.first().bannable) {
            message.delete()
            const victim = message.mentions.users.first();
            const victimMember = message.mentions.members.first();
            let victimId = victim.id;
            const randomDojutsu = Math.random();
            let dojutsu;
            let banReason = 'disrupting the peace';
            if (isNaN(arguments[1])) { banReason = arguments[1];}
            if (randomDojutsu >= 0.666) { dojutsu = 'Sharingan'}
            else if (randomDojutsu >= 0.333) { dojutsu = 'Byakugan'}
            else { dojutsu = 'Rinnegan'}
            victim.send(`You were banned at, ${date.toLocaleString()}, for ${banReason}.`)
            message.channel.send(`Rasenganed user \`${victimId}\`, aka ${victim} with the help of my ${dojutsu} for ${banReason}.`)
        
            victimMember.roles.cache.forEach(role => {
                if (role.name !== "@everyone") {
                    victimMember.roles.remove(role)
                }
            });
            setTimeout(function() {
                victimMember.roles.add('739877917097721938')
            }, 1000)

            const channelName = `ban-ticket-${victimId}`
            message.guild.channels.create(channelName, { topic: `Ban appeal for ${victimId}`}).then(c => {
                const moderator = message.guild.roles.cache.find(role => role.id === '739624806319652906')
                const everyone = message.guild.roles.cache.find(role => role.name === "@everyone")
                
                c.updateOverwrite(moderator, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                });
                c.updateOverwrite(everyone, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: false,
                });
                c.updateOverwrite(victim, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                });
                const banTicket = new Discord.MessageEmbed()
                    .setAuthor(victim.username, victim.displayAvatarURL)
                    .addField('Ban Information', banReason)
                    .setFooter(`${victim} has been banned. Here is a ban appeal.`)
                    .setTimestamp()
                    .setColor('RED')
                c.send(banTicket)
            }).catch(console.error)
        }
        return;
    }

    if(command === `samsara`){
        if (!message.member.hasPermission('BAN_MEMBERS')) return noPerms(message)
        if (message.mentions.users.first()) {
            message.delete()
            let victim = message.mentions.users.first();
            let victimId = victim.id;
            message.channel.send(`Revived user \`${victimId}\`, aka ${victim} with Samsara of Heavenly Life Technique.`)
            message.mentions.members.first().roles.remove('739877917097721938')
            setTimeout(function() {
                message.channel.delete()
            }, 15000)
        }
        return;
    }

    if (command === `kamui`) {
        let i = arguments[0] + 1
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return noPerms(message)
        if (isNaN(i)) {
            message.delete()
            message.channel.send('My Byakugan can see many things, but a number was not found :expressionless:.')
            return;
        }
        if (i >= 100 || i < 1) { i = 99}
        message.delete()

        message.channel.bulkDelete(i, true).catch(err => {
            console.error(err);
            message.channel.send('My Sharingan failed me!');
        });

        let cleaningMessage = message.channel.send('Cleaned with my Sharingan :eye: :tongue: :eye: .')
        setTimeout(function() {
            cleaningMessage.then(m => {
                m.delete()
            })
        }, 5000)
        return;
    }

    if (command === `apply`) {
        if (message.channel.id !== '739648663671799878') {
            message.delete()
            let response = message.channel.send(`Wow ${message.author}. Please apply in #role-apply :triumph:`)
            setTimeout(function() {
                response.then(m => {
                    m.delete()
                })
            }, 5000)
            return;
        }
        if (arguments.length > 1) {
            let role = arguments[0]
            let extraInfo = ''
            extraInfo = message.content.substr(13 + role.length, message.content.length)

            const roleTicket = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .addField('Role', role)
                .addField('Extra Information', extraInfo)
                .setColor('RED')
            message.delete()
            let creationMessage = message.channel.send(`Ticket created for ${message.author}. It will be reviewed soon :unamused:...`)
            let ticketMessage = message.channel.send(roleTicket)
            setTimeout(function() {
                creationMessage.then(m => {
                    m.delete()
                })
                ticketMessage.then(m => {
                    m.delete()
                })
            }, 15000)
            bot.channels.fetch('739662417209983066').then(c => {
                c.send(roleTicket)
            })
            console.log(`New ticket for ${message.author}, applying for ${role}. ${extraInfo}`)
        }
        else {
            wrongParams(message, 'shaggy apply [Role] [Reasoning/information]')
        }
        return;
    }

    if (command === `request`) {
        if (message.channel.id !== '739648399803940976') return wrongChannel(message)
    
        if (arguments.length > 1) {
            let modOrApi = arguments[0]
            let info = ''
            info = message.content.substr(15 + modOrApi.length, message.content.length)
            db.add(`featureRequests`, 1)
            let requestNum = db.fetch(`featureRequests`)

            const requestTicket = new Discord.MessageEmbed()
                .setAuthor(message.author.username + `-${requestNum}`, message.author.displayAvatarURL)
                .addField('Mod or API request', modOrApi)
                .addField('Information', info)
                .setFooter(`${message.author.id}-${requestNum}`)
                .setColor('GREEN')
            message.delete()
            let creationMessage = message.channel.send(`Request ticket created from ${message.author} for ${modOrApi}. It will be reviewed soon :thinking: :grimacing: ...`)
            let ticketMessage = message.channel.send(requestTicket)
            setTimeout(function() {
                creationMessage.then(m => {
                    m.delete()
                })
                ticketMessage.then(m => {
                    m.delete()
                })
            }, 15000)
            bot.channels.fetch('739660759214194839').then(c => {
                c.send(requestTicket)
                c.send(`Respond to this ticket in the DMs of ${message.author.username}.`)
            })
            message.author.send(requestTicket)
            message.author.send(`You made a feature request :sunglasses:, the ID is ${requestNum}. You'll get updates/questions here from Collaborators, watch out for the changelog too :eyes:!`)
            console.log(`New request ticket from ${message.author}, for ${modOrApi}. That would ${info}`)
        }
        else {
            wrongParams(message, 'shaggy request [Mod/API] [Information]')
        }
        return;
    }

    if (command === `getchannelid`) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return noPerms(message)
        message.delete()
        let id = message.channel.id
        message.channel.send(`My Byakugan reveals, \`${id}\``)
        return;
    }

    if (command === `getroleid`) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return noPerms(message)
        message.delete()
        if (message.mentions.roles.first()) {
            let id = message.mentions.roles.first().id
            message.channel.send(`My Byakugan reveals, \`${id}\``)
        }
        return;
    }

    if (command === `requestcount`) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return noPerms(message)
        message.delete()
        let num = db.fetch(`featureRequests`)
        message.channel.send(`There has been a total of , \`${num}\``)
        return;
    }

    if (command === `requestset`) {
        if (arguments.length <= 0) return wrongParams(message, 'shaggy requestset [Amount]')
        let i = arguments[0]
        if (!message.member.hasPermission('MANAGE_ROLES')) return noPerms(message)
        if (isNaN(i)) {
            message.delete()
            message.channel.send('My Byakugan can see many things, but a number was not found :expressionless:.')
            return;
        }
        db.set(`featureRequests`, i)
        message.delete()
        let response = message.channel.send(`Feature requests amount set to ${i} :triumph:.`)
        setTimeout(function() {
            response.then(m => {
                m.delete()
            })
        }, 5000)
        return;
    }

    if (command === `messagecount`) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return noPerms(message)
        let mentioned = message.mentions.users.first() || message.author
        let messages = db.fetch(`guildMessages_${message.guild.id}_${mentioned.id}`)
        let response = message.channel.send(`${mentioned} has typed ${messages} messages :astonished: .`)
        message.delete()
        setTimeout(function() {
            response.then(m => {
                m.delete()
            })
        }, 5000)
        return;
    }

    if (command === `messageset`) {
        if (arguments.length <= 1) return wrongParams(message, 'shaggy messageset [User] [Amount]')
        let i = arguments[1]
        let victim = message.mentions.users.first()
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return noPerms(message)
        if (isNaN(i)) {
            message.delete()
            message.channel.send('My Byakugan can see many things, but a number was not found :expressionless:.')
            return;
        }
        db.set(`guildMessages_${message.guild.id}_${victim.id}`, i)
        message.delete()
        let response = message.channel.send(`${victim} messages amount set to ${i} :triumph:.`)
        setTimeout(function() {
            response.then(m => {
                m.delete()
            })
        }, 5000)
        return;
    }

    if (command === 'help') {
        message.delete()
        message.author.send(':man_in_motorized_wheelchair: :rewind: You asked for help! To introduce myself, I am the Official Bot of the BeNM Server. Here are a list of my commands.')
        const commands = new Discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL)
            .addField('help', 'Summons me.')
            .addField('rasengan [User]', 'Bans a user.')
            .addField('samsara [User]', 'Unbans a user.')
            .addField('kamui [Number]', 'Clears a number of messages.')
            .addField('apply [Role] [Reasoning/Information]', 'Applies for a role.')
            .addField('request [Mod or API request] [Information]', 'Requests a feature for the BeNM Mod or API.')
            .addField('getroleid [Role]', 'Gets the ID of a role.')
            .addField('getchannelid', 'Gets the ID of that channel.')
            .addField('messagecount [User]', 'Gets the amount of messages the mentioned user has sent.')
            .addField('messageset [User] [Amount]', 'Sets the amount of messages the mentioned user has sent.')
            .addField('requestcount', 'Gets the amount of feature requests the server has created.')
            .addField('requestset [Amount]', 'Sets the amount of feature requests the server has created.')
            .setColor('BLUE')
        message.author.send(commands)
        return;
    }
})

function noPerms(message) {
    let response = message.reply('My Byakugan senses you don\'t have permissions, and Samehada is hungry :grimacing:.')
    message.delete()
    setTimeout(function() {
        response.then(m => {
            m.delete()
        })
    }, 5000)
}

function wrongChannel(message) {
    let response = message.reply('Wrong channel, and my friends are lonely in Kamui :grimacing:.')
    message.delete()
    setTimeout(function() {
        response.then(m => {
            m.delete()
        })
    }, 5000)
}

function wrongParams(message, command) {
    let response = message.reply(`${message.author} I'm disapointed :disapointed:. Paramters not met, \`${params}\``)
    message.delete()
    setTimeout(function() {
        response.then(m => {
            m.delete()
        })
    }, 5000)
}

bot.login(token);
