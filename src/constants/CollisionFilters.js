import Categories from './Categories';
import Masks from './Masks';

const group = 0;

export default {
    PLAYER: {
        group,
        category: Categories.PLAYER,
        mask: Masks.PLAYER,
    },
    CPU: {
        group,
        category: Categories.CPU,
        mask: Masks.CPU,
    },
    BULLETS: {
        PLAYER: {
            group,
            category: Categories.BULLET.PLAYER,
            mask: Masks.BULLET,
        },
        CPU: {
            group,
            category: Categories.BULLET.CPU,
            mask: Masks.BULLET,
        },
    },
    PLANET: {
        group,
        category: Categories.PLANET,
        mask: Masks.PLANET,
    },
    PARTICLE: {
        group,
        category: Categories.PARTICLE,
        mask: Masks.PARTICLE,
    },
    TRAIL: {
        group,
        category: Categories.TRAIL,
        mask: Masks.TRAIL,
    },
    WALL: {
        group,
        category: Categories.WALL,
        mask: Masks.WALL,
    },
    LAST_SHOT_INDICATOR: {
        group,
        category: Categories.LAST_SHOT_INDICATOR,
        mask: Masks.LAST_SHOT_INDICATOR,
    },
};
