<script>
  import Matter from "matter-js";
  import MatterAttractors from "matter-attractors";
  import { onMount } from "svelte";
  import { factory } from './factory.js';
  import { 
    engine,
    runner,
    render,
    world, 
    player, 
    bulletSettings, 
    hasWon, 
    radians
    } from './stores.js';

  onMount(() => {
    setupMatter();
    let planet = factory.createPlanet(680, 480, 60);
    player.set(factory.createPlayer(250, 250, 20));
    let cpu = factory.createCpu(650, 650, 20);
    listenForHitOnCpu($engine, cpu);
    populateWorld([ planet, $player, cpu ]);
  });

  const setupMatter = () => {
    render.set(factory.createRender(document, "canvas", $engine));
    Matter.Runner.run($runner, $engine);
    Matter.Render.run($render);
    $engine.world.gravity.scale = 0;
    world.set($engine.world);
  }

  const listenForHitOnCpu = (engineInternal, cpu) =>
    Matter.Events.on(engineInternal, "collisionStart", (event) => {
      let pairs = event.pairs[0];
      if (pairs.bodyA.id == cpu.id || pairs.bodyB.id == cpu.id) {
        hasWon.set(true);
      }
    });

  const populateWorld = (objectsToAdd) => 
    Matter.World.add($world, objectsToAdd);

  const fire = () => {
    let bullet = factory.createBullet($player, $bulletSettings.size);
    let force = factory.createBulletForce($radians, $bulletSettings.velocity);

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