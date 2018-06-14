const cheerio_client = require('cheerio-httpcli');
const CronJob = require('cron').CronJob;
const Discord = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
let general_channnel;

const client = new Discord.Client();
client.on('ready', async () => {
	client.user.setUsername("トイレ工場産のLlamaちゃん");
	general_channel = await client.channels.find(val => val.name == "general");
});

client.on('message', mes => {
	if(mes.content == "!fsb start") {
		check_service_status.start();
		mes.channel.send('メンテ状況の監視を始めるよ');
	}
	if(mes.content == "!fsb stop") {
		check_service_status.stop();
		mes.channel.send('メンテ状況の監視終わるよー');
	}
});



client.login(token);



const check_service_status = new CronJob('*/3 * * * * *', async () => {
	const $ = (await cheerio_client.fetch("https://status.epicgames.com")).$
	const underMainte = await $('span.component-status').filter(function () { return $(this).text().match(/Under Maintenance/)})
	if(underMainte.length != 0) return
	general_channel.send('メンテ終わり！Fortnite遊べるよ！')
	console.log('メンテ終わり！Fortnite遊べるよ！')
	check_service_status.stop();
},
null,
false,
"Asia/Tokyo"
);
