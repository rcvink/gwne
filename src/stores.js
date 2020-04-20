import { writable, derived, readable } from 'svelte/store';
import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
Matter.use(MatterAttractors);

const position = {
    x: 0,
    y: 0
};
const categories = {
    player: 0x0001,
    cpu: 0x0002,
    bullet: {
        player: 0x0004,
        cpu: 0x0008,
    },
    planet: 0x0016
};
const group = 0;

export const densities = readable({
    planet: 0.4,
    bullet: 0.1
});
export const collisionFilters = readable({
    player: {
        group,
        category: categories.player,
        mask: categories.bullet.cpu 
    },
    cpu: {
        group,
        category: categories.cpu,
        mask: categories.bullet.player
    },
    bullets: {
        player: {
            group,
            category: categories.bullet.player,
            mask: categories.cpu | categories.planet
        },
        cpu: {
            group,
            category: categories.bullet.cpu,
            mask: categories.player | categories.planet
        }
    },
    planet: {
        group,
        category: categories.planet,
        mask: categories.bullet.player | categories.bullet.cpu
    }
});
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
