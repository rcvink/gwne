import Matter from "matter-js";
import Render from "./Render";
import { CONSTANTS } from './constants'
import { service } from './service';

const createEngine = () =>
  Matter.Engine.create({enableSleeping: true});

const createRunner = () =>
  Matter.Runner.create();

const createWalls = (renderWidth, renderHeight) => {
  let { top, bottom, left, right } = service
    .getWallsDimensions(renderWidth, renderHeight);

  return [
    createRectangle(top, CONSTANTS.WALL_OPTIONS),
    createRectangle(bottom, CONSTANTS.WALL_OPTIONS),
    createRectangle(left, CONSTANTS.WALL_OPTIONS),
    createRectangle(right, CONSTANTS.WALL_OPTIONS),
  ];
}

const createPlanet = (renderWidth, renderHeight) => {
  let { x, y, r } = service.getPlanetDimensions(renderWidth, renderHeight);
  let planet = createCircle(x, y, r, CONSTANTS.PLANET_OPTIONS);
  Matter.Body.setDensity(planet, CONSTANTS.DENSITIES.planet);
  planet.plugin = { attractors: [ service.gravityOnColliders ] };
  return planet;
}

const createPlayer = (renderWidth, renderHeight) => {
  let { x, y } = service.getPlayerDimensions(renderWidth, renderHeight);
  return createSquare(x, y, CONSTANTS.PLAYER_LENGTH, CONSTANTS.PLAYER_OPTIONS);
}

const createCpu = (renderWidth, renderHeight) => {
  let { x, y } = service.getCpuDimensions(renderWidth, renderHeight);
  return createSquare(x, y, CONSTANTS.CPU_LENGTH, CONSTANTS.CPU_OPTIONS);
}

const createRender = (document, engine) =>
  Render.create({
    element: document.getElementById(CONSTANTS.CANVAS_ID),
    engine: engine,
    options: {
      width: Math.min(
        document.documentElement.clientWidth, 
        CONSTANTS.RENDER_MAX_WIDTH),
      height: Math.min(
        document.documentElement.clientHeight, 
        CONSTANTS.RENDER_MAX_HEIGHT),
      showShotIndicator: true
    }
  });

const createMouse = (canvas) =>
  Matter.Mouse.create(canvas);

const createMouseConstraint = (engine, mouse) => 
  Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: { render: { visible: false } }
  });

const createBullet = (fromBody, offset, rads, collisionFilter) => {
  let translateBy = Matter.Vector.mult(createVector(rads), offset);
  let position = Matter.Vector.add(fromBody.position, translateBy);
  let options = CONSTANTS.BULLET_OPTIONS;
  options.collisionFilter = collisionFilter;
  return createCircle(
    position.x,
    position.y,
    CONSTANTS.BULLET_SIZE,
    options);
}

const createBulletForce = (radians, velocity) =>
  Matter.Vector.mult(createVector(radians), velocity);

const createParticles = (fromBody) => {
  let particles = [];

  for (let i = 0; i <= CONSTANTS.EXPLOSION_PARTICLE_COUNT; i++) {
    particles.push(createCircle(
      fromBody.position.x, 
      fromBody.position.y, 
      Matter.Common.random(
        CONSTANTS.PARTICLE_SIZE_MIN, 
        CONSTANTS.PARTICLE_SIZE_MAX), 
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

const createLastShotIndicator = (position) =>
  createCircle(
    position.x,
    position.y,
    CONSTANTS.LAST_SHOT_INDICATOR_SIZE,
    CONSTANTS.LAST_SHOT_INDICATOR_OPTIONS);

const createRectangle = (dims, options) =>
  Matter.Bodies.rectangle(dims.x, dims.y, dims.w, dims.h, options);

const createSquare = (x, y, length, options) =>
  Matter.Bodies.rectangle(x, y, length, length, options);

const createCircle = (x, y, radius, options) =>
  Matter.Bodies.circle(x, y, radius, options);

const createVector = (radians) =>
  Matter.Vector.create(Math.cos(radians), Math.sin(radians));

export const factory = {
  createEngine,
  createRunner,
  createWalls,
  createPlanet,
  createCpu,
  createPlayer,
  createRender,
  createMouse,
  createMouseConstraint,
  createBullet,
  createBulletForce,
  createParticles,
  createTrail,
  createLastShotIndicator,
};
