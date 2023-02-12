<script lang="ts">
  //@ts-nocheck
  import { inSession, userCharacter } from "./globals";
  import { currentUser, pb } from "./pocketbase";
  import { onMount } from "svelte";
    import App from "../App.svelte";
    import CreateCharacter from "./CreateCharacter.svelte";

  export let session: any;

  let characterCreationScreen = false;
  function backToDash() {
    $inSession = false;
  }

    async function getCharacterData() {
    userCharacter.set(undefined);
    try {
      userCharacter.set(
        await pb
          .collection("characters")
          .getFirstListItem(
            `owner="${$currentUser.id}" && session="${session.id}"`
          )
      );
    } catch (e) {
      console.error("No characters associated with account. 404");
    }
  }
    async function showCreateCharacterForm() {
    characterCreationScreen
      ? (characterCreationScreen = false)
      : (characterCreationScreen = true);
  }


  onMount(async () => {
    await getCharacterData();
  });
</script>

<div class="h-[90%] w-[90%] bg-white rounded-lg flex relative justify-center">
  <h1 class="text-2xl font-bold underline">{session.session_name}</h1>
  {#if $userCharacter}
    <p>{$userCharacter.character_name}</p>
  {:else}
    <button
      on:click="{showCreateCharacterForm}"
      class="h-fit text-gray-100 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl bg-green-400 absolute top-5 left-2"
      >Create character</button
    >
  {/if}

  <button
    on:click="{backToDash}"
    class="text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl bg-yellow-600 absolute bottom-2"
    >Back to Dashboard</button
  >
</div>
{#if characterCreationScreen}
<CreateCharacter bind:characterCreationScreen={characterCreationScreen}/>
{/if}