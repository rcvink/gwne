import { writable, derived, readable } from 'svelte/store';
import Matter from "matter-js";

const position = {
    x: 0,
    y: 0
};
export const engine = writable(Matter.Engine.create({ 
    enableSleeping: true 
}));
export const runner = writable(Matter.Runner.create());
export const render = writable();
export const world = writable();
export const player = writable({ position });
export const cpu = writable({ position });
export const bulletSettings = writable({
    size: 3,
    angleDegrees: 320,
    velocity: 7
});
export const hasHitCpu = writable(false);
export const hasHitPlayer = writable(false);
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
