import CollisionFilters from './CollisionFilters';
import Densities from './Densities';
import Renders from './Renders';
import SleepThresholds from './SleepThresholds';

const frictionAir = 0;

const BULLET = {
    density: Densities.BULLET,
    frictionAir,
};
const CPU = {
    collisionFilter: CollisionFilters.CPU,
    isStatic: true,
    render: Renders.CPU,
    sleepThreshold: SleepThresholds.LONG,
};
const LAST_SHOT_INDICATOR = {
    collisionFilter: CollisionFilters.LAST_SHOT_INDICATOR,
    isStatic: true,
    render: Renders.LAST_SHOT_INDICATOR,
    sleepThreshold: SleepThresholds.LONG,
};
const PARTICLE = {
    collisionFilter: CollisionFilters.PARTICLE,
    density: Densities.PARTICLE,
    frictionAir,
    render: Renders.PARTICLE,
    sleepThreshold: SleepThresholds.SHORT,
};
const PLANET = {
    collisionFilter: CollisionFilters.PLANET,
    isStatic: true,
    render: Renders.PLANET,
    sleepThreshold: SleepThresholds.LONG,
};
const PLAYER = {
    collisionFilter: CollisionFilters.PLAYER,
    isStatic: true,
    render: Renders.PLAYER,
    sleepThreshold: SleepThresholds.LONG,
};
const TRAIL = {
    collisionFilter: CollisionFilters.TRAIL,
    isSensor: true,
    isStatic: true,
    render: Renders.TRAIL,
    sleepThreshold: SleepThresholds.SHORT,
};
const WALL = {
    collisionFilter: CollisionFilters.WALL,
    isStatic: true,
    sleepThreshold: SleepThresholds.LONG
};

export default {
    BULLET,
    CPU,
    LAST_SHOT_INDICATOR,
    PARTICLE,
    PLANET,
    PLAYER,
    TRAIL,
    WALL,
};
