import Matter from 'matter-js';

export default {
    PLAYER: Matter.Body.nextCategory(),
    CPU: Matter.Body.nextCategory(),
    BULLET: {
        PLAYER: Matter.Body.nextCategory(),
        CPU: Matter.Body.nextCategory(),
    },
    PLANET: Matter.Body.nextCategory(),
    PARTICLE: Matter.Body.nextCategory(),
    TRAIL: Matter.Body.nextCategory(),
    WALL: Matter.Body.nextCategory(),
    LAST_SHOT_INDICATOR: Matter.Body.nextCategory(),
};
