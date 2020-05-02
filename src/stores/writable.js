import { writable } from 'svelte/store';

const position = {
    x: 0,
    y: 0
};
export const engine = writable();
export const runner = writable();
export const render = writable();
export const world = writable();
export const player = writable({ position });
export const cpu = writable({ position });
export const planet = writable({ position });
export const walls = writable([]);
export const mouseConstraint = writable();
export const level = writable(0);
export const mouse = writable({ position });
export const mousedownPosition = writable(position);
export const fireCount = writable(0);
export const playerScore = writable(0);
export const cpuScore = writable(0);
export const isPlayerTurn = writable(true);
export const isShotInProgress = writable(false);
