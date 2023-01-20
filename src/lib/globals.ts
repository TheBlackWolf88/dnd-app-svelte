import { writable } from "svelte/store";
import { currentUser, pb } from "./pocketbase";

export let userSessions=writable( await pb.collection('sessions').getFullList(100, {filter : `dm = "${currentUser}" || players ~ "${currentUser}"`}));
export let inSession = writable(false);