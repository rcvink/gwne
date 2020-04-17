<script>
  import Matter from "matter-js";
  import MatterAttractors from "matter-attractors";
  import { onMount } from "svelte";
  Matter.use(MatterAttractors);

  let Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Common = Matter.Common,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector,
    Body = Matter.Body,
    Events = Matter.Events;
  let world;
  let player;
  let bulletSize = 10;
  let bulletAngleDegrees = 45;
  let bulletVelocity = 1;
  $: bulletAngleRadians = (bulletAngleDegrees * Math.PI) / 180;
  let result = "in progress";

  onMount(() => {
    let engine = Engine.create();
    let render = Render.create({
      element: document.getElementById("canvas"),
      engine: engine,
      options: {
        width: Math.min(document.documentElement.clientWidth, 1024),
        height: Math.min(document.documentElement.clientHeight, 720),
        wireframes: false
      }
    });

    let runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    world = engine.world;
    world.gravity.scale = 0;

    let planet = createPlanet(
      (2 * render.options.width) / 3,
      (2 * render.options.height) / 3,
      60
    );
    Body.setDensity(planet, 0.4);

    player = createPlayer(250, 250, 20);
    let cpu = createCpu(650, 650, 20);

    Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs[0];
      if (pairs.bodyA.id == cpu.id || pairs.bodyB.id == cpu.id) {
        result = "won!";
      }
    });

    World.add(world, [planet, player, cpu]);
  });

  const createPlanet = (x, y, radius) =>
    Bodies.circle(x, y, radius, {
      isStatic: true,
      plugin: { attractors: [ MatterAttractors.Attractors.gravity ] }
    });

  const createPlayer = (x, y, length) =>
    createStaticRectangle(x, y, length, true);

  const createCpu = (x, y, length) =>
    createStaticRectangle(x, y, length, false);

  const createStaticRectangle = (x, y, length, isSensor) =>
    Bodies.rectangle(x, y, length, length, { isStatic: true, isSensor });

  const fire = () => {
    let bullet = Bodies.circle(
      player.position.x,
      player.position.y,
      bulletSize,
      { density: 0.1 }
    );

    let force = Vector.mult(
      Vector.create(Math.cos(bulletAngleRadians), Math.sin(bulletAngleRadians)), 
      bulletVelocity);

    World.add(world, bullet);
    Body.applyForce(
      bullet,
      bullet.position,
      force);
  };
</script>

<div>
  <button on:click={fire}>fire</button>
</div>
<div>
  size:
  <input type="number" bind:value={bulletSize} min="3" max="20"/>
</div>
<div>
  angle:
  <input type="number" bind:value={bulletAngleDegrees} min="90" max="360"/>
</div>
<div>
  velocity:
  <input type="number" bind:value={bulletVelocity} min="1" max="10"/>
</div>

{result}

<div id="canvas"/>