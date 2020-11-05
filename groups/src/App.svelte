<script>
  import { findGeneratingPaths } from "./groups"
  import ElGrapho from "ElGrapho";
  import { onMount } from "svelte";

  let modulo = 61
  let element = 2

  let mounted
  onMount(()=>{
    draw(modulo, element)
    mounted = true
  })

  $: {
    if (mounted) draw(modulo, element)
  }

  function draw(modulo, element) {
    if (modulo >= 0 && element < modulo && element >= 0 && modulo === Math.floor(modulo) && element === Math.floor(element)) {

      let paths = findGeneratingPaths(modulo)
      const x0 = 0.001
      const y0 = 0
  
      let nodes = [...Array(modulo).keys()].map((i)=>{
        let theta = Math.PI/180 * (360/modulo) * i;
        let cs = Math.cos(theta);
        let sn = Math.sin(theta);
        let x = x0 * cs - y0 * sn; 
        let y = x0 * sn + y0 * cs;
        return {x: x, y: y, group: i, label: i}
      })
  
      let edges = []
      for (var i = 1; i < paths[element].length; i++) {
        edges.push({from: paths[element][i-1], to: paths[element][i]})
      }

      let parentElement = document.getElementById('parent') 
      let elm = document.getElementById('container')
      elm.setAttribute("style","width:" + parentElement.clientWidth + "px")
      elm.setAttribute("style","height:" + parentElement.clientHeight + "px")
  
      new ElGrapho({
        container: document.getElementById('container'),
        model: {
          nodes: nodes,
          edges: edges,
        },
        width: parentElement.clientHeight,
        height: parentElement.clientHeight,
      });
    }
  }

  let animating = false;
  let animationInterval;
  let atInterval = 1000
  function animate() {
    animating = true
    animationInterval = setInterval(() => {
      if (element === modulo - 1) {
        modulo++
        element = 0
      } else {
        element++
      }
    }, atInterval);
  }

  function stopAnimating() {
    animating = false
    clearInterval(animationInterval)
  }

  function updateInterval() {
    stopAnimating()
    animate()
  }
</script>


<style>
  #controls {
    /* width: 200px; */
  }

  #container {
    margin: 10px;
    height: 500px;
    width: 500px;
  }
  
  #parent {
    width: 100%;
    height: 100%;
  }

  #top {
    display: flex;
    flex-flow: horizontal;
    height: 100%;
  }

  h1 {
    text-align: center;
    width: 100%;
  }
</style>

<div id="top">
  <div id="controls">
    <h1><a href="https://en.wikipedia.org/wiki/Modular_exponentiation">Modular Exponentiation</a></h1>
    <div>
      <label>Group Size</label>
      <input type="number" bind:value={modulo} step=1 min=1}> 
    </div>
    <div>
      <label>Element</label>
      <input type="number" bind:value={element} step=1 min=0 max={modulo - 1}>
    </div>
    {#if !animating}
    <button on:click={animate}>Animate</button>
    {:else}
    <button on:click={stopAnimating}>Stop Animating</button>
    {/if}
    <label>Every {atInterval/1000} seconds</label>
    <input type="range" min=200 max=5000 step=100 bind:value={atInterval} on:input={updateInterval}>
  </div>
  <div id="parent">
    <div id="container"></div>
  </div>
</div>