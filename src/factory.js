import Matter from "matter-js";
import MatterAttractors from "matter-attractors";

const createPlanet = (x, y, radius, collisionFilter, density) => {
  let options = {
    isStatic: true,
    collisionFilter,
    plugin: { attractors: [MatterAttractors.Attractors.gravity] }
  };
  let planet = createCircle(x, y, radius, options);
  Matter.Body.setDensity(planet, density);
  return planet;
}

const createCpu = (x, y, length, collisionFilter) =>
  createStaticRectangle(x, y, length, collisionFilter);

const createPlayer = (x, y, length, collisionFilter) =>
  createStaticRectangle(x, y, length, collisionFilter);

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

const createStaticRectangle = (x, y, length, collisionFilter) =>
  Matter.Bodies.rectangle(x, y, length, length,
    {
      isStatic: true,
      collisionFilter
    });

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
  createBulletForce
};
