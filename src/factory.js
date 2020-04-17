import Matter from "matter-js";
import MatterAttractors from "matter-attractors";

const planetDensity = 0.4;
const bulletDensity = 0.1;

const createPlanet = (x, y, radius) => {
    let newPlanet = createCircle(x, y, radius, true, true);
    Matter.Body.setDensity(newPlanet, planetDensity);
    return newPlanet;
}

const createCpu = (x, y, length) =>
    createStaticRectangle(x, y, length, false);

const createPlayer = (x, y, length) =>
    createStaticRectangle(x, y, length, true);

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

const createBullet = (player, size) =>
    Matter.Bodies.circle(
        player.position.x,
        player.position.y,
        size,
        { density: bulletDensity }
    );

const createBulletForce = (radians, velocity) =>
    Matter.Vector.mult(createVector(radians), velocity);

const createCircle = (x, y, radius, isStatic, hasGravity) => {
    let options = {
        isStatic,
        plugin: hasGravity ? 
            { attractors: [ MatterAttractors.Attractors.gravity ]} : 
            null
    };

    return Matter.Bodies.circle(x, y, radius, options);
}

const createStaticRectangle = (x, y, length, isSensor) =>
    Matter.Bodies.rectangle(x, y, length, length, { isStatic: true, isSensor });

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
