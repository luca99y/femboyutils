/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
	ApplicationCommandInputType,
	CommandContext,
	findOption,
	RequiredMessageOption,
	sendBotMessage,
} from "@api/Commands";
import {
	addPreSendListener,
	MessageObject,
	removePreSendListener,
} from "@api/MessageEvents";
import { addButton } from "@api/MessagePopover";
import definePlugin from "@utils/types";
import { ChannelStore } from "@webpack/common";

import UwUifier from "./uwu";
import { UwUifyicon } from "./uwuifyicon";
const uwuifier = new UwUifier();

import Femboyfy from "./femboyfy";
const femboyfier = new Femboyfy();

let uwutoggle = false;
let femboytoggle = false;

async function handle_messages(message: MessageObject) {
	if (uwutoggle) {
		message.content = await uwuifier.uwuifySentence(message.content);
	}
	if (femboytoggle) {
		message.content = femboyfier.femboyfy(message.content);
	}
}

function toggleuwuify(ctx: CommandContext) {
	if (!uwutoggle) {
		uwutoggle = true;
		const content = "UwUifier is now enabled";
		sendBotMessage(ctx.channel.id, { content });
	} else {
		uwutoggle = false;
		const content = "UwUifier is now disabled";
		sendBotMessage(ctx.channel.id, { content });
	}
}

function togglefemboyfy(ctx: CommandContext) {
	if (!femboytoggle) {
		femboytoggle = true;
		const content = "Femboyfier is now enabled";
		sendBotMessage(ctx.channel.id, { content });
	} else {
		femboytoggle = false;
		const content = "Femboyfier is now disabled";
		sendBotMessage(ctx.channel.id, { content });
	}
}

function lurk(id) {
	Vencord.Webpack.findByProps("joinGuild")
		.joinGuild(id, { lurker: true })
		.then(() => {
			setTimeout(() => patchGuild(id), 100);
		})
		.catch(() => {
			throw new Error("Guild is not lurkable");
		});
}

function patchGuild(id) {
	Vencord.Webpack.findByProps("getGuildsTree")
		.getGuildsTree()
		.root.children.unshift({
			type: "guild",
			id,
			unavailable: false,
			children: [],
		});
	Vencord.Webpack.findByProps("getGuildCount").getGuild(id).joinedAt =
		new Date();
	Vencord.Webpack.findByProps("lurkingGuildIds").lurkingGuildIds().pop();
	Vencord.Webpack.findByProps("joinGuild").transitionToGuildSync(id);
}

function start_lurk(opts, ctx) {
	const id = findOption(opts, "message", "");
	lurk(id);
	const content = "Now lurking server";
	sendBotMessage(ctx.channel.id, { content });
}

function rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchReddit() {
	const sub = "FemboyThighsClub";
	const res = await fetch(
		`https://www.reddit.com/r/${sub}/top.json?limit=100&t=all`
	);
	const resp = await res.json();
	try {
		const { children } = resp.data;
		let r = rand(0, children.length - 1);
		while (children[r].data.domain !== "i.redd.it") {
			console.log(children[r].data.url);
			r = rand(0, children.length - 1);
		}
		return children[r].data.url;
	} catch (err) {
		console.error(resp);
		console.error(err);
	}
	return "";
}

export default definePlugin({
	name: "Femboy utils",
	description: "Utilities for every femboy",
	authors: [
		{
			name: "Luca99",
			id: 1207731371884150804n,
		},
	],
	dependencies: ["CommandsAPI"],
	commands: [
		{
			name: "femboyfy",
			description: "adds :3 and UwU to end of message",
			options: [RequiredMessageOption],
			execute: opts => ({
				content: findOption(opts, "message", "") + " :3 UwU",
			}),
		},
		{
			name: "lurk",
			description: "Lurks a server by id",
			options: [RequiredMessageOption],
			execute: (opts, ctx) => {
				start_lurk(opts, ctx);
			},
		},
		{
			name: "arch",
			description: "sends i use arch btw",
			execute: opts => ({
				content: "I use arch btw",
			}),
		},
		{
			name: "uwuify",
			description: "Uwuify all text you send",
			options: [RequiredMessageOption],
			execute: opts => ({
				content: uwuifier.uwuifySentence(
					findOption(opts, "message", "")
				),
			}),
		},
		{
			name: "toggle uwuify",
			description: "Uwuify all text you send",
			inputType: ApplicationCommandInputType.BOT,
			execute: (opts, ctx) => {
				toggleuwuify(ctx);
			},
		},
		{
			name: "toggle femboyfy",
			description: "Femboyfys all text you send",
			inputType: ApplicationCommandInputType.BOT,
			execute: (opts, ctx) => {
				togglefemboyfy(ctx);
			},
		},
		{
			name: "femboy thighs",
			description: "Sends a thigh high picture from reddit",
			execute: async ctx => {
				return {
					content: await fetchReddit(),
				};
			},
		},
	],
	patches: [],

	start() {
		addButton("luca-uwuify", message => {
			if (!message.content) return null;

			return {
				label: "UwUify",
				icon: UwUifyicon,
				message,
				channel: ChannelStore.getChannel(message.channel_id),
				onClick: async () => {
					const content = await uwuifier.uwuifySentence(
						message.content
					);
					sendBotMessage(message.channel_id, { content });
				},
			};
		});
		this.preSend = addPreSendListener(async (_, message) => {
			await handle_messages(message);
		});
	},
	stop() {
		this.preSend = removePreSendListener(async (_, message) => {
			await handle_messages(message);
		});
	},
});
