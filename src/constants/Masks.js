import Categories from './Categories';

export default {
    BULLET: Categories.PLAYER |
        Categories.CPU |
        Categories.PLANET |
        Categories.WALL,
    CPU: Categories.BULLET.PLAYER |
        Categories.BULLET.CPU,
    LAST_SHOT_INDICATOR: Categories.LAST_SHOT_INDICATOR,
    PARTICLE: Categories.PARTICLE,
    PLANET: Categories.BULLET.PLAYER |
        Categories.BULLET.CPU,
    PLAYER: Categories.BULLET.CPU |
        Categories.BULLET.PLAYER,
    TRAIL: Categories.TRAIL,
    WALL: Categories.BULLET.PLAYER |
        Categories.BULLET.CPU,
};
