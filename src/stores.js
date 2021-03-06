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
export const mouseConstraint = writable();
export const level = writable(0);
export const mouse = writable({ position });
export const mousedownPosition = writable(position);
export const fireCount = writable(0);
export const playerScore = writable(0);
export const cpuScore = writable(0);
export const isPlayerTurn = writable(true);
export const isShotInProgress = writable(false);

export const currentPlayerDegrees = derived(
    [ mouse, player ],
    ([ $mouse, $player ]) =>
        Math.round(Math.atan2(
            $mouse.position.y - $player.position.y, 
            $mouse.position.x - $player.position.x) * 
        (180 / Math.PI)));
export const playerRadians = derived(
    [ mousedownPosition, player ],
    ([ $mousedownPosition, $player ]) =>
        Math.atan2(
            $mousedownPosition.y - $player.position.y,
            $mousedownPosition.x - $player.position.x));
export const lastPlayerDegrees = derived(
    [ fireCount, playerRadians ], 
    ([ $fireCount, $playerRadians ]) => 
        $fireCount > 0 ? Math.round($playerRadians * (180 / Math.PI)) + "°" : null);
export const currentPlayerVelocity = derived(
    [ mouse, player ],
    ([ $mouse, $player ]) => {
        let velocity = CONSTANTS.PLAYER_VELOCITY_FACTOR * Math.hypot(
            $player.position.x - $mouse.position.x,
            $player.position.y - $mouse.position.y);
        return Math.round(velocity * 10) / 10;
    });
export const playerVelocity = derived(
    [ mousedownPosition, player ],
    ([ $mousedownPosition, $player ]) =>
        CONSTANTS.PLAYER_VELOCITY_FACTOR * Math.hypot(
            $player.position.x - $mousedownPosition.x,
            $player.position.y - $mousedownPosition.y));
export const lastPlayerVelocity = derived(
    [ fireCount, playerVelocity ],
    ([ $fireCount, $playerVelocity ]) =>
        $fireCount > 0 ? $playerVelocity.toFixed(1) : null);
export const cpuRadians = derived(
    [ player, cpu ],
    ([$player, $cpu]) =>
        Math.atan2(
            $player.position.y - $cpu.position.y, 
            $player.position.x - $cpu.position.x));
export const isShootingEnabled = derived(
    [ isPlayerTurn, isShotInProgress ],
    ([ $isPlayerTurn, $isShotInProgress ]) =>
        $isPlayerTurn && !$isShotInProgress);
