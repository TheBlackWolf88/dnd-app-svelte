import { writable } from "svelte/store";
import { currentUser, pb } from "./pocketbase";

export var userSessions=writable( await pb.collection('sessions').getFullList(100, {filter : `dm = "${currentUser}" || players ~ "${currentUser}"`}));