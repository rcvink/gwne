import Matter from "matter-js";
import { CONSTANTS } from './constants'
import { service } from './service';

const createPlanet = (x, y, radius) => {
  let planet = createCircle(x, y, radius, CONSTANTS.PLANET_OPTIONS);
  Matter.Body.setDensity(planet, CONSTANTS.DENSITIES.planet);
  planet.plugin = { attractors: [ service.gravityOnColliders ] };
  return planet;
}

const createPlayer = (x, y, length) =>
    createSquare(x, y, length, CONSTANTS.PLAYER_OPTIONS);

const createCpu = (x, y, length) =>
    createSquare(x, y, length, CONSTANTS.CPU_OPTIONS);

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
