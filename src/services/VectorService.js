import Matter from 'matter-js';

const createBulletForce = (radians, velocity) =>
    Matter.Vector.mult(createVector(radians), velocity);

const createVector = (radians) =>
    Matter.Vector.create(Math.cos(radians), Math.sin(radians));

export default {
    createBulletForce,
    createVector,
};
