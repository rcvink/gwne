import { writable, derived, readable } from 'svelte/store';
import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
Matter.use(MatterAttractors);

const position = {
    x: 0,
    y: 0
}

export const engine = writable(Matter.Engine.create());
export const runner = writable(Matter.Runner.create());
export const render = writable();
export const world = writable();
export const player = writable({ position });
export const cpu = writable({ position });
export const bulletSettings = writable({
    size: 10,
    angleDegrees: 45,
    velocity: 1
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
export const cpuBulletVelocity = readable(1);
export const fireCount = writable(0);
