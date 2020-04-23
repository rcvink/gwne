import Matter from "matter-js";

const SLEEP_THRESHOLD_LONG = 1e10;
const SLEEP_THRESHOLD_SHORT = 120;
const group = 0;

const CATEGORIES = {
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
const COLLISION_FILTERS = {
    player: {
        group,
        category: CATEGORIES.player,
        mask: CATEGORIES.bullet.cpu 
    },
    cpu: {
        group,
        category: CATEGORIES.cpu,
        mask: CATEGORIES.bullet.player
    },
    bullets: {
        player: {
            group,
            category: CATEGORIES.bullet.player,
            mask: CATEGORIES.cpu | 
                CATEGORIES.planet | 
                CATEGORIES.bullet.player | 
                CATEGORIES.bullet.cpu
        },
        cpu: {
            group,
            category: CATEGORIES.bullet.cpu,
            mask: CATEGORIES.player | 
                CATEGORIES.planet |
                CATEGORIES.bullet.player | 
                CATEGORIES.bullet.cpu
        }
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
    }
}
const CPU_BULLET_VELOCITY = 7;
const CPU_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.cpu,
    render: {
        fillStyle: "firebrick"
    },
    sleepThreshold: SLEEP_THRESHOLD_LONG
};
const DENSITIES = {
    planet: 2,
    bullet: 5,
    particle: 5
};
const EXPLOSION_PARTICLE_COUNT = 10;
const GRAVITATIONAL_CONSTANT = 0.0001;
const PARTICLE_OPTIONS = {
    collisionFilter: COLLISION_FILTERS.particle,
    density: DENSITIES.particle,
    render: {
        fillStyle: "orange",
    },
    sleepThreshold: SLEEP_THRESHOLD_SHORT,
};
const PLANET_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.planet,
    render: {
      fillStyle: "saddlebrown",
    },
    sleepThreshold: SLEEP_THRESHOLD_LONG,
};
const PLAYER_OPTIONS = {
    isStatic: true,
    collisionFilter: COLLISION_FILTERS.player,
    render: {
        fillStyle: "darkslateblue",
    },
    sleepThreshold: SLEEP_THRESHOLD_LONG,
};
const TRAIL_OPTIONS = {
    isStatic: true,
    isSensor: true,
    collisionFilter: COLLISION_FILTERS.trail,
    render: {
        fillStyle: "orange",
    },
    sleepThreshold: SLEEP_THRESHOLD_SHORT,
};

export const CONSTANTS = { 
    CATEGORIES,
    COLLISION_FILTERS,
    CPU_BULLET_VELOCITY,
    CPU_OPTIONS,
    DENSITIES,
    EXPLOSION_PARTICLE_COUNT,
    GRAVITATIONAL_CONSTANT,
    PARTICLE_OPTIONS,
    PLANET_OPTIONS,
    PLAYER_OPTIONS,
    TRAIL_OPTIONS,
};