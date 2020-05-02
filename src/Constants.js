import Matter from "matter-js";

const SLEEP_THRESHOLD_LONG = 1e10;
const SLEEP_THRESHOLD_SHORT = 120;
const group = 0;
const frictionAir = 0;
const DENSITIES = {
    planet: 2,
    bullet: 5,
    particle: 5
};
const RENDERS = {
    cpu: {
        fillStyle: "firebrick"
    },
    particle: {
        fillStyle: "orange",
    },
    planet: {
        fillStyle: "saddlebrown",
    },
    player: {
        fillStyle: "darkslateblue",
    },
    trail: {
        fillStyle: "orange",
    },
    lastShotIndicator: {
        fillStyle: "gainsboro"
    }
};

const BULLET_SIZE = 3;
const BULLET_OPTIONS = {
    density: DENSITIES.bullet,
    frictionAir,
};
const CANVAS_ID = "canvas";
const CATEGORIES = {
    player: Matter.Body.nextCategory(),
    cpu: Matter.Body.nextCategory(),
    bullet: {
        player: Matter.Body.nextCategory(),
        cpu: Matter.Body.nextCategory(),
    },
    planet: Matter.Body.nextCategory(),
    particle: Matter.Body.nextCategory(),
    trail: Matter.Body.nextCategory(),
    wall: Matter.Body.nextCategory(),
    lastShotIndicator: Matter.Body.nextCategory(),
};
const MASKS = {
    bullet: CATEGORIES.player |
        CATEGORIES.cpu | 
        CATEGORIES.planet |
        CATEGORIES.wall,
    cpu: CATEGORIES.bullet.player | 
        CATEGORIES.bullet.cpu,
    particle: CATEGORIES.particle,
    planet: CATEGORIES.bullet.player | 
        CATEGORIES.bullet.cpu,
    player: CATEGORIES.bullet.cpu | 
        CATEGORIES.bullet.player,
    trail: CATEGORIES.trail,
    wall: CATEGORIES.bullet.player | 
        CATEGORIES.bullet.cpu,
};
const COLLISION_FILTERS = {
    player: {
        group,
        category: CATEGORIES.player,
        mask: MASKS.player,
    },
    cpu: {
        group,
        category: CATEGORIES.cpu,
        mask: MASKS.cpu,
    },
    bullets: {
        player: {
            group,
            category: CATEGORIES.bullet.player,
            mask: MASKS.bullet,
        },
        cpu: {
            group,
            category: CATEGORIES.bullet.cpu,
            mask: MASKS.bullet,
        },
    },
    planet: {
        group,
        category: CATEGORIES.planet,
        mask: CATEGORIES.bullet.player | CATEGORIES.bullet.cpu
    },
    particle: {
        group,
        category: CATEGORIES.particle,
        mask: CATEGORIES.particle
    },
    trail: {
        group,
        category: CATEGORIES.trail,
        mask: CATEGORIES.trail
    },
    wall: {
        group,
        category: CATEGORIES.wall,
        mask: CATEGORIES.bullet.player | CATEGORIES.bullet.cpu
    },
    lastShotIndicator: {
        group,
        category: CATEGORIES.lastShotIndicator
    }
};
const CPU_ANGLE_RANDOMNESS_FACTOR = 0.1;
const CPU_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.cpu,
    render: RENDERS.cpu,
    sleepThreshold: SLEEP_THRESHOLD_LONG
};
const CPU_LENGTH = 20;
const CPU_VELOCITY_MIN = 4;
const CPU_VELOCITY_MAX = 9;
const EXPLOSION_PARTICLE_COUNT = 10;
const GRAVITATIONAL_CONSTANT = 0.001;
const LAST_SHOT_INDICATOR_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.lastShotIndicator,
    render: RENDERS.lastShotIndicator,
    sleepThreshold: SLEEP_THRESHOLD_LONG,
}
const LAST_SHOT_INDICATOR_SIZE = 2;
const PARTICLE_OPTIONS = {
    collisionFilter: COLLISION_FILTERS.particle,
    density: DENSITIES.particle,
    render: RENDERS.particle,
    sleepThreshold: SLEEP_THRESHOLD_SHORT,
    frictionAir
};
const PARTICLE_SIZE_MIN = 1;
const PARTICLE_SIZE_MAX = 4;
const PLANET_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.planet,
    render: RENDERS.planet,
    sleepThreshold: SLEEP_THRESHOLD_LONG,
};
const PLANET_RADIUS_MIN = 30;
const PLAYER_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.player,
    render: RENDERS.player,
    sleepThreshold: SLEEP_THRESHOLD_LONG,
};
const PLAYER_LENGTH = 20;
const PLAYER_VELOCITY_FACTOR = 0.01;
const RENDER_MAX_WIDTH = 1024;
const RENDER_MAX_HEIGHT = 720;
const TRAIL_BULLET_SIZE = 2;
const TRAIL_PARTICLE_SIZE = 1;
const TRAIL_OPTIONS = {
    isStatic: true,
    isSensor: true,
    collisionFilter: COLLISION_FILTERS.trail,
    render: RENDERS.trail,
    sleepThreshold: SLEEP_THRESHOLD_SHORT,
};
const WALL_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.wall,
    sleepThreshold: SLEEP_THRESHOLD_LONG
};
const WALL_THICKNESS = 50;

export default {
    BULLET_OPTIONS, 
    BULLET_SIZE,
    CANVAS_ID,
    CATEGORIES,
    COLLISION_FILTERS,
    CPU_ANGLE_RANDOMNESS_FACTOR,
    CPU_LENGTH,
    CPU_OPTIONS,
    CPU_VELOCITY_MIN,
    CPU_VELOCITY_MAX,
    DENSITIES,
    EXPLOSION_PARTICLE_COUNT,
    GRAVITATIONAL_CONSTANT,
    LAST_SHOT_INDICATOR_OPTIONS,
    LAST_SHOT_INDICATOR_SIZE,
    PARTICLE_OPTIONS,
    PARTICLE_SIZE_MIN,
    PARTICLE_SIZE_MAX,
    PLANET_RADIUS_MIN,
    PLANET_OPTIONS,
    PLAYER_OPTIONS,
    PLAYER_LENGTH,
    PLAYER_VELOCITY_FACTOR,
    RENDER_MAX_HEIGHT,
    RENDER_MAX_WIDTH,
    TRAIL_BULLET_SIZE,
    TRAIL_PARTICLE_SIZE,
    TRAIL_OPTIONS,
    WALL_OPTIONS,
    WALL_THICKNESS,
};
