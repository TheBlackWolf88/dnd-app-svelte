
<script lang=ts>
    //@ts-nocheck
    import { writable } from "svelte/store";
    import { getRandomIntInclusive, inSession, userCharacter } from "./globals";
    import { currentUser, pb } from "./pocketbase";
    import { onMount } from "svelte";
    import { Record } from "pocketbase";

    export let session:any

    let characterCreationScreen = false

    let stats = [0,0,0,0,0,0]


    function backToDash(){
        $inSession = false
    }

    function generateStats(){
        for (let i = 0; i< stats.length; i++){
            stats[i] = getRandomIntInclusive(3, 18);
        }
        stats = stats
    }

    async function getCharacterData() {
        userCharacter.set(undefined)
        try {
            userCharacter.set(await pb.collection("characters").getFirstListItem(`owner="${$currentUser.id}" && session="${session.id}"`))
        } catch (e) {
            console.error("No characters associated with account. 404")    
        }
    }

/*
So I tought my first comment should explain not the code but that shithole I call my database. Most especially the character table, because it in fact is confusing.
characters table
ability_scores: A JSON file containing the 6 basic stats (str, dex, con, int, wis, cha).
basic_stats: another JSON file which contains the following keys:class(+subclass), level,ac, speed, current_hp, max_hp, thp, hit_dice, prof_b, spellcasting_ability.
feats: text, list of feats
profs_langs: JSON with two very obvious keys: proficiencies,equipment_profs, languages
weapons: a text field at last. describes the weapon, in this fashion "[name], [behaves as], [array of bonus_features]"
spells: a JSON of a bitch again. has spell levels as keys, and arrays of spell names as values.
inventory: JSON, itemname:count fashion
appearance: JSON with keys: age, height, weight, eyes, hair, skin, optional__url_to_art
background: JSON shit with keys: pers_traits, ideals, bonds, flaws, allies_orgs, backstory

That's all folks. Quite simple right?
na megyek, mert erre inni kell(ene)
*/

async function showCreateCharacterForm() {
    characterCreationScreen ? characterCreationScreen = false : characterCreationScreen=true
}

async function createCharacter() {
    
}

onMount(async() => {
    await getCharacterData() 
})

</script>

<div class="h-[90%] w-[90%] bg-white rounded-lg flex relative justify-center">
    <h1 class="text-2xl font-bold underline">{session.session_name}</h1>
    {#if $userCharacter}
        <p>{$userCharacter.character_name}</p>
    {:else}
        <button on:click={showCreateCharacterForm} class="h-fit text-gray-100 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl bg-green-400 absolute top-5 left-2">Create character</button>
    {/if}
    
    <button on:click={backToDash} class="text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl bg-yellow-600 absolute bottom-2">Back to Dashboard</button>

</div>
{#if characterCreationScreen}
   <div class="fixed inset-0 backdrop-blur-md overflow-y-auto h-full w-full align-middle">
        <div class="fixed top-0 bottom-0 left-0 right-0 m-auto z-50 flex p-4 h-modal md:h-fit bg-gray-200 w-fit rounded-2xl">
            <button
                    on:click={showCreateCharacterForm}
                    class="absolute top-5 right-5 text-right text-gray-400 hover:text-black"
                    >✖</button
                >
            <form on:submit|preventDefault={createCharacter}></form>
                <ul>
                    <h1 class="font-bold text-xl underline text-center">Create a character</h1>

                    <li><button on:click|preventDefault={generateStats}>Generate stats</button></li>
                    <li>stats: [{stats}]</li>
                    <br>
                    <li><input type="text" placeholder="Character name"></li>
                </ul>
        </div>
   </div> 
{/if}