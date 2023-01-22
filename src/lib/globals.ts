import { writable } from "svelte/store";
import { currentUser, pb } from "./pocketbase";

export let userSessions=writable( await pb.collection('sessions').getFullList(100, {filter : `dm = "${currentUser}" || players ~ "${currentUser}"`}));
export let inSession = writable(false);
export let userCharacter = writable(await pb.collection('characters').getFullList())

export function getRandomIntInclusive(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  