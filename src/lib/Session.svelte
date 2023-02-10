<script lang="ts">
  //@ts-nocheck
  import { getRandomIntInclusive, inSession, userCharacter } from "./globals";
  import { currentUser, pb } from "./pocketbase";
  import { onMount } from "svelte";
    import App from "../App.svelte";

  export let session: any;

  let pClass 
  let characterCreationScreen = false;
  let profChoices;

  let stats = [0, 0, 0, 0, 0, 0];
  let canGenAgain = true;
  let submitted = false;

  let pages = {
    0: ["Name", "Race", "Class", "Subclass"],
    1: [
      "Strength",
      "Dexterity",
      "Constitution",
      "Intelligence",
      "Wisdom",
      "Charisma",
    ],
  };
  let i = 0;
  let canSubmit = false;
  let character = {
    name: "",
    race: "",
    class: "",
    subclass: "",
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,
    givenProficiencies: [],
    savingThrows: [],
  };


  function backToDash() {
    $inSession = false;
  }

  function generateStats() {
    if (!canGenAgain) return;
    for (let i = 0; i < stats.length; i++) {
      let rolls = [
        getRandomIntInclusive(1, 6),
        getRandomIntInclusive(1, 6),
        getRandomIntInclusive(1, 6),
        getRandomIntInclusive(1, 6),
      ];
      rolls = rolls.sort();
      rolls = rolls.slice(1, 4);
      stats[i] = rolls[0] + rolls[1] + rolls[2];
    }
    stats = stats;
    canGenAgain = false;
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
  function incPage() {
    if (i == Object.keys(pages).length - 1) return;
    if (i == Object.keys(pages).length - 2) canSubmit = true;
    i++;
  }
  async function getClass() {
    return await fetch(
      `https://www.dnd5eapi.co/api/classes/${character.class.toLowerCase()}`
    );
  }

  async function showCreateCharacterForm() {
    characterCreationScreen
      ? (characterCreationScreen = false)
      : (characterCreationScreen = true);
    i = 0;
    canSubmit = false;
  }

  async function createCharacter() {
    console.log('Prevent hasn"t defaulted');
    //console.log(character)
    pClass = await (await getClass()).json()
    submitted = true;
    character.givenProficiencies = pClass.proficiencies.map((item:any) => {
      console.log(item['name'])
      return item['name'].startsWith("Saving") ? null : item['name']
    }).filter((item) => {
      return item != null
    })
    profChoices = pClass.proficiency_choices[0].from.options.map((item:any) => {
      return item.item['name']
    })
    console.log(profChoices)
    character.savingThrows = pClass.proficiencies.map((item) => {
      return item['name'].startsWith("Saving") ? item['name'].slice(13) : null
    }).filter((item) => {
      return item != null
    })

    
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
  <div
    class="fixed inset-0 backdrop-blur-md overflow-y-auto h-full w-full align-middle"
  >
    <div
      class="fixed top-0 bottom-0 left-0 right-0 m-auto z-50 flex p-4 h-modal md:h-fit bg-gray-200 w-fit rounded-2xl"
    >
      <button
        on:click="{showCreateCharacterForm}"
        class="absolute top-5 right-5 text-right text-gray-400 hover:text-black"
        >✖</button
      >
      <form on:submit|preventDefault="{createCharacter}">
        <ul>
          <h1 class="font-bold text-xl underline text-center">
            Create a character
          </h1>
          <br />
          {#if i == 1}
            <li>
              <button on:click|preventDefault="{generateStats}"
                >Generate stats</button
              >
            </li>
            <li>stats: [{stats}]</li>
            <br />
          {/if}
          {#each pages[i] as page}
            <li>
              <input
                placeholder="{page}"
                bind:value="{character[page.toLowerCase()]}"
              />
            </li>
            <br />
          {/each}
          {#if !canSubmit}
            <li class=" flex justify-center">
              <button
                class="w=fit text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl bg-green-700"
                on:click|preventDefault="{incPage}">Next</button
              >
            </li>
          {:else}
            <li class=" flex justify-center">
              <button
                class="w=fit text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl bg-green-700"
                >Submit</button
              >
            </li>
          {/if}
        </ul>
      </form>
      {#if submitted}
        <ul>
          {#each Object.entries(character) as val}
            <li>{val[0]} : {val[1]}</li>
            <br />
          {/each}
        </ul>
      {/if}
    </div>
  </div>
{/if}
