<style>
.hide-scroll-bar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.hide-scroll-bar::-webkit-scrollbar {
    display: none;
}
</style>

<script lang="ts">
    import App from "../App.svelte";
    import { currentUser, pb } from "./pocketbase";

    function signOut() {
        pb.authStore.clear();
    }

    async function logSessions(){
        let cu:string = $currentUser.id
        const session = await pb.collection('sessions').getFullList(...[], {})
        console.log($currentUser.id)
        //{filter: `dungeon_masta = ${$currentUser.id}`}
        console.log(session)
    }
</script>

<h1 class="absolute top-1/4 text-3xl text-white font-bold">Welcome {$currentUser.username}!</h1>
<div class="flex flex-col m-auto p-auto">
    <div class="flex overflow-x-scroll pb-10 hide-scroll-bar">
        <div class="flex flex-nowrap ml-5 ">
            {#each Array(5) as _}
                <div class="inline-block px-3">
                    <div
                        class="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
                    />
                </div>
            {/each}
        </div>
    </div>
</div>
<button on:click={logSessions} class="absolute bottom-400">Log sessions</button>
<button on:click={signOut} class="bg-red-700 text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl absolute bottom-1/4">Sign Out</button>
