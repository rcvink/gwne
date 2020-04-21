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
    collisionFilters,
    densities,
    numberOfParticlesInExplosion
    } from './stores.js';

  onMount(() => {
    setupMatter();
    let planet = factory.createPlanet(680, 480, 120, $collisionFilters.planet, $densities.planet);
    player.set(factory.createPlayer(250, 250, 20, $collisionFilters.player));
    cpu.set(factory.createCpu(530, 20, 20, $collisionFilters.cpu));
    cpuFireOnPlayerFire(
      fireCount, 
      $cpu, 
      $cpuRadians, 
      $cpuBulletVelocity,
      $collisionFilters.bullets.cpu,
      $densities.bullet);
    setFlagTrueOnHit($engine, $cpu.id, hasHitCpu);
    setFlagTrueOnHit($engine, $player.id, hasHitPlayer);
    explodeOnHit($engine, $cpu.id);
    explodeOnHit($engine, $player.id);
    explodeOnHit($engine, planet.id);
    populateWorld([ planet, $player, $cpu ]);
  });

  const onClick = () => {
    fire(
      $player, 
      $playerRadians, 
      $bulletSettings.velocity, 
      $collisionFilters.bullets.player,
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

  const cpuFireOnPlayerFire = (fireCountInternal, cpuInternal, rads, velocity, collisionFilter, density) =>
    fireCountInternal.subscribe((newValue) => {
      if (newValue > 0) {
        fire(cpuInternal, rads, velocity, collisionFilter, density);
      }
    }); 

  const setFlagTrueOnHit= (engineInternal, bodyId, flag) =>
    onHitBody(engineInternal, bodyId, () => flag.set(true));

  const explodeOnHit = (engineInternal, idOfSurvivingBody) =>
    Matter.Events.on(engineInternal, "collisionStart", (event) => 
      explode(event.pairs[0], idOfSurvivingBody));

  const explode = (pairs, idOfSurvivingBody) => {
    let bullet;

    if (pairs.bodyA.id === idOfSurvivingBody) {
      bullet = pairs.bodyB;
    } else if (pairs.bodyB.id === idOfSurvivingBody) {
      bullet = pairs.bodyA;
    } else {
      return null;
    }

    populateWorld(
      factory.createParticles(
        bullet.position.x, 
        bullet.position.y, 
        $numberOfParticlesInExplosion, 
        { 
          collisionFilter: $collisionFilters.particle,
          density: $densities.bullet,
        }));
    removeFromWorld(bullet);
  }

  const populateWorld = (objectsToAdd) =>
    Matter.World.add($world, objectsToAdd);

  const removeFromWorld = (objectsToRemove) =>
    Matter.World.remove($world, objectsToRemove);

  const fire = (fromBody, rads, velocity, collisionFilter, density) => {
    let bullet = factory.createBullet(
      fromBody, 
      $bulletSettings.size, 
      collisionFilter, 
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
