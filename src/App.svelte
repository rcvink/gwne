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
    hasHitCpu,
    hasHitPlayer,
    playerRadians,
    fireCount,
    cpu,
    cpuRadians,
    cpuBulletVelocity,
    collisionGroups,
    densities
    } from './stores.js';

  onMount(() => {
    setupMatter();
    let planet = factory.createPlanet(680, 480, 60, $collisionGroups.planet, $densities.planet);
    player.set(factory.createPlayer(250, 250, 20, $collisionGroups.player));
    cpu.set(factory.createCpu(530, 20, 20, $collisionGroups.cpu));
    cpuFireOnPlayerFire(
      fireCount, 
      $cpu, 
      $cpuRadians, 
      $cpuBulletVelocity,
      $collisionGroups.bullets.cpu,
      $densities.bullet);
    setFlagTrueOnHit($engine, $cpu.id, hasHitCpu);
    setFlagTrueOnHit($engine, $player.id, hasHitPlayer);
    populateWorld([ planet, $player, $cpu ]);
  });

  const onClick = () => {
    fire(
      $player, 
      $playerRadians, 
      $bulletSettings.velocity, 
      $collisionGroups.bullets.player,
      $densities.bullet);
    fireCount.update(n => n + 1);
  }

  const setupMatter = () => {
    render.set(factory.createRender(document, "canvas", $engine));
    Matter.Runner.run($runner, $engine);
    Matter.Render.run($render);
    $engine.world.gravity.scale = 0;
    world.set($engine.world);
  }

  const cpuFireOnPlayerFire = (fireCountInternal, cpuInternal, rads, velocity, collisionGroup, density) =>
    fireCountInternal.subscribe((newValue) => {
      if (newValue > 0) {
        fire(cpuInternal, rads, velocity, collisionGroup, density);
      }
    }); 

  const setFlagTrueOnHit= (engineInternal, bodyId, flag) =>
    onHitBody(engineInternal, bodyId, () => flag.set(true));

  const populateWorld = (objectsToAdd) =>
    Matter.World.add($world, objectsToAdd);

  const fire = (fromBody, rads, velocity, collisionGroup, density) => {
    let bullet = factory.createBullet(
      fromBody, 
      $bulletSettings.size, 
      collisionGroup, 
      density);

    populateWorld(bullet);
    Matter.Body.applyForce(
      bullet,
      bullet.position,
      factory.createBulletForce(rads, velocity));
  }

  const onHitBody = (engineInternal, bodyId, onHit) =>
    Matter.Events.on(engineInternal, "collisionStart", (event) => {
      let pairs = event.pairs[0];
      if (pairs.bodyA.id === bodyId || pairs.bodyB.id === bodyId) {
        onHit();
      }
    });

</script>

<div>
  size:
  <input type="number" bind:value={$bulletSettings.size} min="3" max="20"/>
</div>
<div>
  angle:
  <input type="number" bind:value={$bulletSettings.angleDegrees} min="0" max="359"/>
</div>
<div>
  velocity:
  <input type="number" bind:value={$bulletSettings.velocity} min="1" max="10"/>
</div>
<div>
  {#if $hasHitPlayer}
    Hit player!
  {:else}
    Player OK.
  {/if}
</div>
<div>
  {#if $hasHitCpu}
    Hit CPU!
  {:else}
    CPU OK.
  {/if}
</div>
<div>
  {$fireCount} shots fired.
</div>
<div id="canvas" on:click={onClick}/>
