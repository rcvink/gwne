import { writable, derived, readable } from 'svelte/store';
import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
Matter.use(MatterAttractors);

const position = {
    x: 0,
    y: 0
};
export const categories = {
    player: Matter.Body.nextCategory(),
    cpu: Matter.Body.nextCategory(),
    bullet: {
        player: Matter.Body.nextCategory(),
        cpu: Matter.Body.nextCategory(),
    },
    planet: Matter.Body.nextCategory(),
    particle: Matter.Body.nextCategory(),
    trail: Matter.Body.nextCategory()
};
const group = 0;

export const numberOfParticlesInExplosion = readable(10);
export const densities = readable({
    planet: 2,
    bullet: 5
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
            mask: categories.cpu | 
                categories.planet | 
                categories.bullet.player | 
                categories.bullet.cpu
        },
        cpu: {
            group,
            category: categories.bullet.cpu,
            mask: categories.player | 
                categories.planet |
                categories.bullet.player | 
                categories.bullet.cpu
        }
    },
    planet: {
        group,
        category: categories.planet,
        mask: categories.bullet.player | categories.bullet.cpu
    },
    particle: {
        group,
        category: categories.particle,
        mask: categories.particle
    },
    trail: {
        group,
        category: categories.trail,
        mask: categories.trail
    }
});
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
export const cpuBulletVelocity = readable(7);
export const fireCount = writable(0);
