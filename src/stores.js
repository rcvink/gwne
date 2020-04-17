import { writable, derived, readable } from 'svelte/store';
import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
Matter.use(MatterAttractors);

export const engine = writable(Matter.Engine.create());
export const runner = writable(Matter.Runner.create());
export const render = writable();
export const world = writable();
export const player = writable();
export const bulletSettings = writable({
    size: 10,
    angleDegrees: 45,
    velocity: 1
});
export const hasWon = writable(false);
export const radians = derived(
    bulletSettings,
    $bulletSettings => ($bulletSettings.angleDegrees * Math.PI) / 180);