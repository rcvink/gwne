import { writable, derived } from 'svelte/store';

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
export const bulletSettings = writable({
    angleDegrees: 320,
    velocity: 7
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
