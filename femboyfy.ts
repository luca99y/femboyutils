/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export default class Femboyfy {
    public ends: string[] = [
        ":3",
        "UwU",
        "~Nya",
        ">:3",
        "<3"
    ];

    public femboyfy(sentence: string): string {
        const randomEnding = this.ends[Math.floor(Math.random() * this.ends.length)];
        const femboyfyiedstring = sentence + " " + randomEnding;
        return femboyfyiedstring;
    }
}
