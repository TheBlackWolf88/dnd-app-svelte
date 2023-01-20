
<script lang=ts>
    import { inSession } from "./globals";

    export let session:any
    //@ts-nocheck


    function backToDash(){
        $inSession = false
    }

</script>

<div class="h-[90%] w-[90%] bg-white rounded-lg">
    <h1>{session.session_name}</h1>
    <button on:click={backToDash} class="text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl bg-yellow-600">Back to Dashboard</button>

</div>