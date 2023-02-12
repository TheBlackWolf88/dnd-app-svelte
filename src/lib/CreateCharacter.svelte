<script lang="ts">
    //@ts-nocheck
    import { getRandomIntInclusive } from "./globals";


    let pClass:Object
  let profChoices:string[];

  let stats = [0, 0, 0, 0, 0, 0];
  let canGenAgain = true;
  let submitted = false;
  export let characterCreationScreen = true
  
  let i = 0;
  let canSubmit = false;
  let character = {
    name: "",
    race: "",
    class: "",
    subclass: "",
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
    hit_dice: 0,
    max_hp: 0,
    current_hp : 0,
    temp_hp: 0,
    proficiency_bonus: 0,
    givenProficiencies: [],
    savingThrows: [],
    proficiencies: [],
    hit_dice : 0
  };

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

function incPage() {
    i++;
  }
  async function getClass() {
    return await fetch(
      `https://www.dnd5eapi.co/api/classes/${character.class.toLowerCase()}`
    );
  }

  $: if(i == 1) callGetClass()
  
  $: if(i == 2 && character.givenProficiencies[0] != character.givenProficiencies[1]) canSubmit = true


  async function callGetClass() {
    pClass = await (await getClass()).json()
    profChoices = await pClass.proficiency_choices[0].from.options.map((item:any) => {
      return item.item['name']
    })
  }

  async function createCharacter() {
    console.log('Prevent hasn"t defaulted');
    //console.log(character)
    submitted = true;
    character.givenProficiencies = pClass.proficiencies.map((item:any) => {
      return item['name'].startsWith("Saving") ? 0 : item['name']
    }).filter((item) => {
      return item != 0
    })
   
    character.savingThrows = pClass.proficiencies.map((item) => {
      return item['name'].startsWith("Saving") ? item['name'].slice(13) : 0
    }).filter((item) => {
      return item != 0
    })

    
  }
  async function showCreateCharacterForm() {
    characterCreationScreen
      ? (characterCreationScreen = false)
      : (characterCreationScreen = true);
    i = 0;
    canSubmit = false;
  }




</script>

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
          {#if i == 0}
            <li><input type="text" placeholder="Name" bind:value="{character.name}"></li>
            <br>
            <li><input type="text" placeholder="Race" bind:value="{character.race}"></li>
            <br><li><input type="text" placeholder="Class" bind:value="{character.class}"></li>
            <br><li><input type="text" placeholder="Subclass" bind:value="{character.subclass}"></li>
          {/if}
          {#if i == 1}
            <li>
              <button on:click|preventDefault="{generateStats}"
                >Generate stats</button
              >
            </li>
            <li>stats: [{stats}]</li>
            <br />
            <li><input type="text" placeholder="Strength" bind:value="{character.str}"></li>
            <br><li><input type="text" placeholder="Dexterity" bind:value="{character.dex}"></li>
            <br><li><input type="text" placeholder="Constitution" bind:value="{character.con}"></li>
            <br><li><input type="text" placeholder="Intelligence" bind:value="{character.int}"></li>
            <br><li><input type="text" placeholder="Wisdom" bind:value="{character.wis}"></li>
            <br><li><input type="text" placeholder="Charisma" bind:value="{character.cha}"></li>
          {/if}
          {#if i == 2}
            <li class="text-center font-bold text-lg">Choose proficiencies</li><br>
            <select bind:value="{character.proficiencies[0]}">
              {#each profChoices as choice}
                <option value="{choice.slice(7)}">{choice}</option>
              {/each}
            </select>
            <br>
           <select bind:value="{character.proficiencies[1]}">
              {#each profChoices as choice}
                <option value="{choice.slice(7)}">{choice}</option>
              {/each}
            </select>
         {/if}
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
