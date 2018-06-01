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
		mes.channel.send('start check status!');
	}
	if(mes.content == "!fsb stop") {
		check_service_status.stop();
		mes.channel.send('stop check status!');
	}
});



client.login(token);



const check_service_status = new CronJob('*/5 * * * * *', () => {
		cheerio_client.fetch('https://status.epicgames.com/', (err, $, res) => {
			let isStopAnyService = false;
			$('span.component-status').each(function (idx) {
				if($(this).text().match(/Under Maintenance/)) {
					isStopAnyService = true;
				}
				if(!isStopAnyService) {
					isStopAnyService = true;
					general_channel.send('サーバー動き出したよ！')
					check_service_status.stop();
				}
			});
		});
	},
	null,
	false,
	"Asia/Tokyo"
);
