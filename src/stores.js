import { writable, derived } from 'svelte/store';

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