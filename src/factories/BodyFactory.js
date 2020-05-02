import Matter from 'matter-js';
import Constants from '../Constants';
import Dimensions from '../constants/Dimensions';
import DimensionService from '../services/DimensionService';
import GravityService from '../services/GravityService';
import VectorService from '../services/VectorService';

const createBullet = (fromBody, offset, rads, collisionFilter) => {
    let translateBy = Matter.Vector.mult(VectorService.createVector(rads), offset);
    let position = Matter.Vector.add(fromBody.position, translateBy);
    let options = Constants.BULLET_OPTIONS;
    options.collisionFilter = collisionFilter;
    return createCircle(
        position.x,
        position.y,
        Dimensions.BULLET_SIZE,
        options);
}

const createCpu = (renderWidth, renderHeight) => {
    let { x, y } = DimensionService.getCpuDimensions(renderWidth, renderHeight);
    return createSquare(x, y, Dimensions.CPU_LENGTH, Constants.CPU_OPTIONS);
}

const createLastShotIndicator = (position) =>
    createCircle(
        position.x,
        position.y,
        Dimensions.LAST_SHOT_INDICATOR_SIZE,
        Constants.LAST_SHOT_INDICATOR_OPTIONS);

const createParticles = (fromBody) => {
    let particles = [];

    for (let i = 0; i <= Constants.EXPLOSION_PARTICLE_COUNT; i++) {
        particles.push(createCircle(
            fromBody.position.x,
            fromBody.position.y,
            Matter.Common.random(
                Dimensions.PARTICLE_SIZE_MIN,
                Dimensions.PARTICLE_SIZE_MAX),
            Constants.PARTICLE_OPTIONS));
    }

    return particles;
}

const createPlanet = (renderWidth, renderHeight) => {
    let { x, y, r } = DimensionService
        .getPlanetDimensions(renderWidth, renderHeight);
    let planet = createCircle(x, y, r, Constants.PLANET_OPTIONS);
    Matter.Body.setDensity(planet, Constants.DENSITIES.planet);
    planet.plugin = { attractors: [GravityService.gravityOnColliders] };
    return planet;
}

const createPlayer = (renderWidth, renderHeight) => {
    let { x, y } = DimensionService.getPlayerDimensions(renderWidth, renderHeight);
    return createSquare(x, y, Dimensions.PLAYER_LENGTH, Constants.PLAYER_OPTIONS);
}

const createTrail = (fromBody, size) =>
    createSquare(
        fromBody.position.x,
        fromBody.position.y,
        size,
        Constants.TRAIL_OPTIONS);

const createWalls = (renderWidth, renderHeight) => {
    let { top, bottom, left, right } = DimensionService
        .getWallsDimensions(renderWidth, renderHeight);

    return [
        createRectangle(top, Constants.WALL_OPTIONS),
        createRectangle(bottom, Constants.WALL_OPTIONS),
        createRectangle(left, Constants.WALL_OPTIONS),
        createRectangle(right, Constants.WALL_OPTIONS),
    ];
}

const createCircle = (x, y, radius, options) =>
    Matter.Bodies.circle(x, y, radius, options);

const createRectangle = (dims, options) =>
    Matter.Bodies.rectangle(dims.x, dims.y, dims.w, dims.h, options);

const createSquare = (x, y, length, options) =>
    Matter.Bodies.rectangle(x, y, length, length, options);

export default {
    createBullet,
    createCpu,
    createLastShotIndicator,
    createParticles,
    createPlanet,
    createPlayer,
    createTrail,
    createWalls,
};
