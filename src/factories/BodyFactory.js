import Matter from 'matter-js';

import BodyOptions from '../constants/BodyOptions';
import Constants from '../Constants';
import Densities from '../constants/Densities';
import Dimensions from '../constants/Dimensions';
import DimensionService from '../services/DimensionService';
import GravityService from '../services/GravityService';
import VectorService from '../services/VectorService';

const createBullet = (fromBody, offset, rads, collisionFilter) => {
    let translateBy = Matter.Vector.mult(VectorService.createVector(rads), offset);
    let position = Matter.Vector.add(fromBody.position, translateBy);
    let options = BodyOptions.BULLET;
    options.collisionFilter = collisionFilter;
    return createCircle(
        position.x,
        position.y,
        Dimensions.BULLET_SIZE,
        options);
}

const createCpu = (renderWidth, renderHeight) => {
    let { x, y } = DimensionService.getCpuDimensions(renderWidth, renderHeight);
    return createSquare(x, y, Dimensions.CPU_LENGTH, BodyOptions.CPU);
}

const createLastShotIndicator = (position) =>
    createCircle(
        position.x,
        position.y,
        Dimensions.LAST_SHOT_INDICATOR_SIZE,
        BodyOptions.LAST_SHOT_INDICATOR);

const createParticles = (fromBody) => {
    let particles = [];

    for (let i = 0; i <= Constants.EXPLOSION_PARTICLE_COUNT; i++) {
        particles.push(createCircle(
            fromBody.position.x,
            fromBody.position.y,
            Matter.Common.random(
                Dimensions.PARTICLE_SIZE_MIN,
                Dimensions.PARTICLE_SIZE_MAX),
                BodyOptions.PARTICLE));
    }

    return particles;
}

const createPlanet = (renderWidth, renderHeight) => {
    let { x, y, r } = DimensionService
        .getPlanetDimensions(renderWidth, renderHeight);
    let planet = createCircle(x, y, r, BodyOptions.PLANET);
    Matter.Body.setDensity(planet, Densities.PLANET);
    planet.plugin = { attractors: [GravityService.gravityOnColliders] };
    return planet;
}

const createPlayer = (renderWidth, renderHeight) => {
    let { x, y } = DimensionService.getPlayerDimensions(renderWidth, renderHeight);
    return createSquare(x, y, Dimensions.PLAYER_LENGTH, BodyOptions.PLAYER);
}

const createTrail = (fromBody, size) =>
    createSquare(
        fromBody.position.x,
        fromBody.position.y,
        size,
        BodyOptions.TRAIL);

const createWalls = (renderWidth, renderHeight) => {
    let { top, bottom, left, right } = DimensionService
        .getWallsDimensions(renderWidth, renderHeight);

    return [
        createRectangle(top, BodyOptions.WALL),
        createRectangle(bottom, BodyOptions.WALL),
        createRectangle(left, BodyOptions.WALL),
        createRectangle(right, BodyOptions.WALL),
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
