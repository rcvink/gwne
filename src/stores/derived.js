import { derived } from 'svelte/store';
import Constants from '../Constants';
import {
    mouse,
    player,
    mousedownPosition,
    fireCount,
    cpu,
    isPlayerTurn,
    isShotInProgress
} from './writable';

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
        let velocity = Constants.PLAYER_VELOCITY_FACTOR * Math.hypot(
            $player.position.x - $mouse.position.x,
            $player.position.y - $mouse.position.y);
        return Math.round(velocity * 10) / 10;
    });
export const playerVelocity = derived(
    [ mousedownPosition, player ],
    ([ $mousedownPosition, $player ]) =>
        Constants.PLAYER_VELOCITY_FACTOR * Math.hypot(
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
