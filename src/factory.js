import Matter from "matter-js";
import MatterAttractors from "matter-attractors";

const createPlanet = (x, y, radius, group, density) => {
  let options = {
    isStatic: true,
    collisionFilter: { group },
    plugin: { attractors: [MatterAttractors.Attractors.gravity] }
  };
  let planet = createCircle(x, y, radius, options);
  Matter.Body.setDensity(planet, density);
  return planet;
}

const createCpu = (x, y, length, collisionGroup) =>
  createStaticRectangle(x, y, length, collisionGroup);

const createPlayer = (x, y, length, collisionGroup) =>
  createStaticRectangle(x, y, length, collisionGroup);

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

const createBullet = (fromBody, size, group, density) =>
  createCircle(
    fromBody.position.x,
    fromBody.position.y,
    size,
    { density, collisionFilter: { group } });

const createBulletForce = (radians, velocity) =>
  Matter.Vector.mult(createVector(radians), velocity);

const createStaticRectangle = (x, y, length, group) =>
  Matter.Bodies.rectangle(x, y, length, length,
    {
      isStatic: true,
      collisionFilter: { group }
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
