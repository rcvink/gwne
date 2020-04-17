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
    Body = Matter.Body;
  let world;
  let player;
  let bulletSize = 10;
  let bulletAngleDegrees = 45;
  let bulletVelocity = 10;
  $: bulletAngleRadians = (bulletAngleDegrees * Math.PI) / 180;

  onMount(() => {
    let engine = Engine.create();
    let render = Render.create({
      element: document.body,
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

    console.log('d', planet.density);
    console.log('m', planet.mass);

    player = createPlayer(250, 250, 1);

    World.add(world, [planet, player]);
  });

  const createPlanet = (x, y, radius) =>
    Bodies.circle(x, y, radius, {
      isStatic: true,
      plugin: { attractors: [ MatterAttractors.Attractors.gravity ] }
    });

  const createPlayer = (x, y, length) =>
    Bodies.rectangle(x, y, length, length, { isStatic: true });

  const fire = () => {
    let bullet = Bodies.circle(
      player.position.x,
      player.position.y,
      bulletSize,
      { density: 0.1 }
    );

    World.add(world, bullet);
    Body.applyForce(
      bullet,
      bullet.position,
      Vector.create(Math.cos(bulletAngleRadians), Math.sin(bulletAngleRadians)));
  };
</script>

<div>
  <button on:click={fire}>fire</button>
</div>
<div>
  size:
  <input type="number" bind:value={bulletSize} />
</div>
<div>
  angle:
  <input type="number" bind:value={bulletAngleDegrees} />
</div>
<div>
  velocity:
  <input type="number" bind:value={bulletVelocity} />
</div>
