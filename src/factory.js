import Matter from "matter-js";
import { service } from './service';

const createPlanet = (x, y, radius, collisionFilter, density) => {
  let options = {
    isStatic: true,
    collisionFilter,
    plugin: { attractors: [service.gravityOnColliders] },
    render: {
      fillStyle: "saddlebrown"
    },
    sleepThreshold: 1e10
  };
  let planet = createCircle(x, y, radius, options);
  Matter.Body.setDensity(planet, density);
  return planet;
}

const createCpu = (x, y, length, collisionFilter) =>
  createSquare(x, y, length, { 
    collisionFilter,
    isStatic: true,
    render: {
      fillStyle: "firebrick"
    },
    sleepThreshold: 1e10
  });

const createPlayer = (x, y, length, collisionFilter) =>
  createSquare(x, y, length, { 
    collisionFilter,
    isStatic: true,
    render: {
      fillStyle: "darkslateblue"
    },
    sleepThreshold: 1e10
  });

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

const createBullet = (fromBody, size, collisionFilter, density) =>
  createCircle(
    fromBody.position.x,
    fromBody.position.y,
    size,
    { density, collisionFilter });

const createBulletForce = (radians, velocity) =>
  Matter.Vector.mult(createVector(radians), velocity);

const createParticles = (x, y, count, options) => {
  let particles = [];

  for (let index = 0; index <= count; index++) {
    particles.push(
      createCircle(x, y, Matter.Common.random(1, 4), options));
  }

  return particles;
}

const createTrail = (x, y, size, collisionFilter) => 
  createSquare(x, y, size, { 
    isStatic: true,
    isSensor: true,
    collisionFilter,
    render: {
      fillStyle: "orange"
    },
    sleepThreshold: 120
  });

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
