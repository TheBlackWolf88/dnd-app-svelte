<script>
    import { onMount } from "svelte";
  import Dash from "./lib/Dash.svelte";
import Login from "./lib/Login.svelte";
  import { currentUser, pb } from "./lib/pocketbase";
   onMount(async()=> await pb.authStore.clear) 
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