import Matter from "matter-js";
import { CONSTANTS } from './constants'
import { service } from './service';

const createPlanet = (renderWidth, renderHeight) => {
  let { x, y, r } = getPlanetDimensions(renderWidth, renderHeight);
  let planet = createCircle(x, y, r, CONSTANTS.PLANET_OPTIONS);
  Matter.Body.setDensity(planet, CONSTANTS.DENSITIES.planet);
  planet.plugin = { attractors: [ service.gravityOnColliders ] };
  return planet;
}

const getPlanetDimensions = (renderWidth, renderHeight) => {
  let rMax = Math.min(renderWidth / 8, renderHeight / 8);
  let r = getRandomInRange(60, rMax); 
  let x = getRandomInRange(
    (renderWidth / 5) + r,
    (3 * renderWidth / 5) - r
  );
  let y = getRandomInRange(
    r + 10,
    renderHeight - r
  );
  return { x, y, r };
}

const getRandomInRange = (min, max) => 
  Math.random() * (max - min) + min;

const createPlayer = (renderWidth, renderHeight, length) => {
  let { x, y } = getPlayerDimensions(renderWidth, renderHeight, length);
  return createSquare(x, y, length, CONSTANTS.PLAYER_OPTIONS);
}

const getPlayerDimensions = (renderWidth, renderHeight, length) => {
  let x = getRandomInRange(
    (length / 2) + 10,
    (renderWidth / 5) - (length / 2)
  );
  let y = getRandomInRange(
    (length / 2) + 10,
    (renderHeight) - (length / 2)
  );
  return { x, y };
}

const createCpu = (renderWidth, renderHeight, length) => {
  let { x, y } = getCpuDimensions(renderWidth, renderHeight, length);
  return createSquare(x, y, length, CONSTANTS.CPU_OPTIONS);
}

const getCpuDimensions = (renderWidth, renderHeight, length) => {
  let x = getRandomInRange(
    (4 * renderWidth / 5) + (length / 2),
    renderWidth - (length / 2) - 10
  );
  let y = getRandomInRange(
    (length / 2) + 10,
    renderHeight - (length / 2) - 10 
  );
  return { x, y };
}

const createRender = (document, canvasId, engine) =>
  Matter.Render.create({
    element: document.getElementById(canvasId),
    engine: engine,
    options: {
      width: Math.min(document.documentElement.clientWidth, 1024),
      height: Math.min(document.documentElement.clientHeight, 720),
      wireframes: false
    }
  });

const createBullet = (fromBody, size, collisionFilter) =>
  createCircle(
    fromBody.position.x,
    fromBody.position.y,
    size,
    { 
      collisionFilter, 
      density: CONSTANTS.DENSITIES.bullet, 
    });

const createBulletForce = (radians, velocity) =>
  Matter.Vector.mult(createVector(radians), velocity);

const createParticles = (fromBody) => {
  let particles = [];

  for (let i = 0; i <= CONSTANTS.EXPLOSION_PARTICLE_COUNT; i++) {
    particles.push(createCircle(
      fromBody.position.x, 
      fromBody.position.y, 
      Matter.Common.random(1, 4), 
      CONSTANTS.PARTICLE_OPTIONS));
  }

  return particles;
}

const createTrail = (fromBody, size) => 
  createSquare(
    fromBody.position.x, 
    fromBody.position.y, 
    size, 
    CONSTANTS.TRAIL_OPTIONS);

const createSquare = (x, y, length, options) =>
  Matter.Bodies.rectangle(x, y, length, length, options);

const createCircle = (x, y, radius, options) =>
  Matter.Bodies.circle(x, y, radius, options);

const createVector = (radians) =>
  Matter.Vector.create(Math.cos(radians), Math.sin(radians));

export const factory = {
  createPlanet,
  createCpu,
  createPlayer,
  createRender,
  createBullet,
  createBulletForce,
  createParticles,
  createTrail
};
