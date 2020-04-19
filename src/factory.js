import Matter from "matter-js";
import MatterAttractors from "matter-attractors";

const planetDensity = 0.4;
const bulletDensity = 0.1;
const collisionGroups = {
    player: -1,
    playerBullet: -1,
    cpu: -2,
    cpuBullet: -2,
    planet: -3,
};

const createPlanet = (x, y, radius) => {
    let options = {
        isStatic: true,
        collisionFilter: { group: collisionGroups.planet },
        plugin: { attractors: [ MatterAttractors.Attractors.gravity ]}
    };
    let planet = Matter.Bodies.circle(x, y, radius, options);
    Matter.Body.setDensity(planet, planetDensity);
    return planet;
}

const createCpu = (x, y, length) =>
    createStaticRectangle(x, y, length, collisionGroups.cpu);

const createPlayer = (x, y, length) =>
    createStaticRectangle(x, y, length, collisionGroups.player);

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

const createBullet = (fromBody, size, group) =>
    Matter.Bodies.circle(
        fromBody.position.x,
        fromBody.position.y,
        size,
        { density: bulletDensity, collisionFilter: { group } }
    );

const createBulletForce = (radians, velocity) =>
    Matter.Vector.mult(createVector(radians), velocity);

const createStaticRectangle = (x, y, length, group) =>
    Matter.Bodies.rectangle(x, y, length, length, 
        { 
            isStatic: true,
            collisionFilter: { group }
         });

const createVector = (radians) =>
    Matter.Vector.create(Math.cos(radians), Math.sin(radians));

export const factory = {
    collisionGroups,
    createPlanet,
    createCpu,
    createPlayer,
    createRender,
    createBullet,
    createBulletForce
};
