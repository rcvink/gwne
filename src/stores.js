import { writable, derived } from 'svelte/store';
import { CONSTANTS } from './constants';

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
export const bulletSettings = writable({
    angleDegrees: 0,
    velocity: CONSTANTS.DEFAULT_VELOCITY
});
export const level = writable(0);
export const playerRadians = derived(
    bulletSettings,
    $bulletSettings => ($bulletSettings.angleDegrees * Math.PI) / 180);
export const cpuRadians = derived(
    [ player, cpu ],
    ([$player, $cpu]) =>
        Math.atan2(
            ($player.position.y - $cpu.position.y), 
            ($player.position.x - $cpu.position.x)));
export const fireCount = writable(0);
export const playerScore = writable(0);
export const cpuScore = writable(0);
export const isPlayerTurn = writable(true);
export const isShotInProgress = writable(false);
