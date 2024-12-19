/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { classes } from "@utils/misc";

import { cl } from "./util";

export function UwUifyicon({ height = 24, width = 24, className }: { height?: number; width?: number; className?: string; }) {
    const viewBoxSize = 960;

    // Calculate the center of the viewBox
    const centerX = viewBoxSize / 2;
    const centerY = viewBoxSize / 2;

    return (
        <svg
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            height={height}
            width={width}
            className={classes(cl("icon"), className)}
        >
            <text x={centerX - 450} y={centerY + 100} fontSize="400" fontFamily="Arial Rounded MT Bold" fill="white">UwU</text>
        </svg>
    );
}
