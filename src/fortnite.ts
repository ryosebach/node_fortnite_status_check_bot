import cheerio_client from "cheerio-httpcli";
import cron from "cron";
import {Client as DiscordClient, Message, TextChannel} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const replyChannels = new Map<string, TextChannel>();

const client = new DiscordClient();

client.login(token);

client.on("message", (mes) => {
    if (mes.content === "!fsb start") {
        CheckServiceStatus.start();
        (mes.channel as TextChannel).send("メンテ状況の監視を始めるよ");
        replyChannels.set((mes.channel as TextChannel).id, mes.channel as TextChannel);
    }
    if (mes.content === "!fsb stop") {
        CheckServiceStatus.stop();
        replyChannels.delete((mes.channel as TextChannel).id);
        (mes.channel as TextChannel).send("メンテ状況の監視を終わるよ");
    }
	if (mes.content === "!health") {
		(mes.channel as TextChannel).send("動作中!");
	}
});

const CheckServiceStatus = new cron.CronJob("*/3 * * * * *", async () => {
    const $ = (await cheerio_client.fetch("https://status.epicgames.com")).$;
    const underMainte = await $("span.component-status").filter(function(this: void) {
        return !$(this).text().match(/Operational/);
    });
    if (underMainte.length !== 0) { return; }
    replyChannels.forEach((channel: TextChannel, id: string) => {
        channel.send("メンテ終わり！Fortnite遊べるよ！");
    });
    replyChannels.clear();

    CheckServiceStatus.stop();
},
    undefined,
    false,
    "Asia/Tokyo",
);
