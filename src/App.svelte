<script>
  import Matter from "matter-js";
  import MatterAttractors from "matter-attractors";
  import { onMount } from "svelte";
  import { 
    world, 
    player, 
    bulletSettings, 
    hasWon, 
    radians 
    } from './stores.js';
  
  Matter.use(MatterAttractors);

  onMount(() => {
    let { engine, render, runner } = createEngineRenderRunner();
    run({ engine, render, runner });

    setGravityZero(engine.world);
    world.set(engine.world);

    let planet = createPlanet(680, 480, 60);
    player.set(createPlayer(250, 250, 20));
    let cpu = createCpu(650, 650, 20);
    listenForHitOnCpu({ engine, cpu });
    populateWorld([ planet, $player, cpu ]);
  });

  const createEngineRenderRunner = () => {
    let engine = Matter.Engine.create();
    let render = Matter.Render.create({
      element: document.getElementById("canvas"),
      engine: engine,
      options: {
        width: Math.min(document.documentElement.clientWidth, 1024),
        height: Math.min(document.documentElement.clientHeight, 720),
        wireframes: false
      }
    });
    let runner = Matter.Runner.create();

    return { engine, render, runner };
  }

  const run = ({ engine, render, runner }) => {
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
  }

  const setGravityZero = (worldInternal) =>
    worldInternal.gravity.scale = 0;

  const createPlanet = (x, y, radius) => {
    let newPlanet = createCircle(x, y, radius, true, true);
    Matter.Body.setDensity(newPlanet, 0.4);
    return newPlanet;
  }

  const createCircle = (x, y, radius, isStatic, hasGravity) =>  
    Matter.Bodies.circle(
      x, 
      y, 
      radius, 
      { 
        isStatic, 
        plugin: hasGravity ? { attractors: [ MatterAttractors.Attractors.gravity ] } : null 
      });
  
  const createPlayer = (x, y, length) =>
    createStaticRectangle(x, y, length, true);

  const createCpu = (x, y, length) =>
    createStaticRectangle(x, y, length, false);

  const createStaticRectangle = (x, y, length, isSensor) =>
    Matter.Bodies.rectangle(x, y, length, length, { isStatic: true, isSensor });

  const listenForHitOnCpu = ({ engine, cpu }) =>
    Matter.Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs[0];
      if (pairs.bodyA.id == cpu.id || pairs.bodyB.id == cpu.id) {
        hasWon.set(true);
      }
    });

  const populateWorld = (objectsToAdd) => 
    Matter.World.add($world, objectsToAdd);

  const fire = () => {
    let bullet = Matter.Bodies.circle(
      $player.position.x,
      $player.position.y,
      $bulletSettings.size,
      { density: 0.1 }
    );

    let force = Matter.Vector.mult(
      Matter.Vector.create(Math.cos($radians), Math.sin($radians)), 
      $bulletSettings.velocity);

    populateWorld(bullet);
    Matter.Body.applyForce(
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
  <input type="number" bind:value={$bulletSettings.size} min="3" max="20"/>
</div>
<div>
  angle:
  <input type="number" bind:value={$bulletSettings.angleDegrees} min="90" max="360"/>
</div>
<div>
  velocity:
  <input type="number" bind:value={$bulletSettings.velocity} min="1" max="10"/>
</div>

{#if $hasWon}
  Won!
{:else}
  Keep trying.
{/if}

<div id="canvas"/>