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
const CPU_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.cpu,
    render: RENDERS.cpu,
    sleepThreshold: SLEEP_THRESHOLD_LONG
};
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
const PARTICLE_OPTIONS = {
    collisionFilter: COLLISION_FILTERS.particle,
    density: DENSITIES.particle,
    render: RENDERS.particle,
    sleepThreshold: SLEEP_THRESHOLD_SHORT,
    frictionAir
};
const PLANET_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.planet,
    render: RENDERS.planet,
    sleepThreshold: SLEEP_THRESHOLD_LONG,
};
const PLAYER_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.player,
    render: RENDERS.player,
    sleepThreshold: SLEEP_THRESHOLD_LONG,
};
const PLAYER_VELOCITY_FACTOR = 0.01;
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

export default {
    BULLET_OPTIONS, 
    CANVAS_ID,
    CATEGORIES,
    COLLISION_FILTERS,
    CPU_OPTIONS,
    CPU_VELOCITY_MIN,
    CPU_VELOCITY_MAX,
    DENSITIES,
    EXPLOSION_PARTICLE_COUNT,
    GRAVITATIONAL_CONSTANT,
    LAST_SHOT_INDICATOR_OPTIONS,
    PARTICLE_OPTIONS,
    PLANET_OPTIONS,
    PLAYER_OPTIONS,
    PLAYER_VELOCITY_FACTOR,
    TRAIL_OPTIONS,
    WALL_OPTIONS,
};
