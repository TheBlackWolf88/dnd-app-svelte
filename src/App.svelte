<script>
  import Dash from "./lib/Dash.svelte";
import Login from "./lib/Login.svelte";
    import { currentUser } from "./lib/pocketbase";
    
</script>

<style global>
  @use "./app.css";
</style>

<div class="flex items-center justify-center align-middle bg-slate-800 w-screen h-screen overflow-x-scroll">
  {#if $currentUser}

    <Dash />

  {:else}
    <Login />
  {/if}
  

</div>