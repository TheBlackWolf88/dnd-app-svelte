<script lang="ts">
    //@ts-nocheck
    import { onMount } from "svelte";
    import { each } from "svelte/internal";
    import { writable } from "svelte/store";
    import App from "../App.svelte";
    import { userSessions, inSession } from "./globals";
    import { currentUser, pb } from "./pocketbase";
    import Session from "./Session.svelte";
    
    let currentSession:object;
    let showCSModal = false;
    let usernames: string[] = [""];
    let session_name: string;
    let session_pw: string;
    function showCreateSession() {
        showCSModal ? (showCSModal = false) : (showCSModal = true);
        usernames = [""];
        session_name = "";
        session_pw = "";
    }
    function signOut() {
        pb.authStore.clear();
    }
    async function getUserId(username: string) {
        const user = await pb
            .collection("users")
            .getFirstListItem(`username = "${username}"`);
        return user.id;
    }
    async function registerIt() {
        try {
            let users: string[] = [];
            for (let i = 0; i < usernames.length; i++) {
                users.push(await getUserId(usernames[i]));
            }
            let data = {
                session_name: session_name,
                session_passwod: session_pw,
                players: users,
                dm: $currentUser.id,
            };
            const record = await pb.collection("sessions").create(data);
        } catch (e) {
            console.error(e);
            alert("An error occured, did you enter the correct usernames?");
        }
        await getSessions();
        showCreateSession();
    }
    function lessPlayer() {
        if (usernames.length == 1) return;
        else {
            usernames.pop();
            usernames = usernames;
        }
    }
    function morePlayer() {
        usernames.push("");
        usernames = usernames;
    }

    async function getSessions() {
        $userSessions = await pb.collection("sessions").getFullList(100, {
            filter: `dm = "${$currentUser.id}" || players ~ "${$currentUser.id}"`,
            expand: "players,dm",
        });
    }

    function openSession(session:object){
        $inSession = true;
        currentSession = session
    }

    onMount(async () => {
        await getSessions();
    });
</script>
{#if !$inSession}
<h1 class="absolute top-1/4 text-3xl text-white font-bold">
    Welcome {$currentUser.username}!
</h1>
<div class="flex flex-col m-auto p-auto items-center">
    <div class="flex overflow-x-scroll pb-10 hide-scroll-bar">
        <div class="flex flex-nowrap ml-5 ">
            {#each $userSessions as session}
                <div class="inline-block px-3">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        on:click={openSession(session)} class="relative w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
                    >
                        <ul class="h-full absolute right-0 left-0 top-0">
                            <li class="text-center font-bold text-xl underline">
                                {session.session_name}
                            </li>
                            <li class="text-sm text-center italic">
                                {session.expand.dm.username}'s session
                            </li>
                            <li class="underline text-lg font-bold text-center">Players</li>
                            {#each session.expand.players as player}
                                <li class="text-center text-lg">{player.username}</li>
                            {/each}
                            <li
                                class="text-center text-sm text-gray-600 italic absolute bottom-0 right-0 left-0"
                            >
                                {session.created.slice(0, 10)}
                            </li>
                        </ul>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <button
        on:click={showCreateSession}
        class="text-gray-200 border-2 border-gray-700 px-5 py-2 mt-1 mb-0 rounded-xl absolute bottom-1/4 bg-gray-500"
        >Create new session</button
    >
    <button
        on:click={signOut}
        class="bg-red-700 text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl absolute top-2 right-2"
        >Sign Out</button
    >
</div>
{#if showCSModal}
    <div
        class="fixed inset-0 backdrop-blur-md overflow-y-auto h-full w-full align-middle"
    >
        <div
            id="newSessionModal"
            aria-hidden="true"
            class="fixed top-0 bottom-0 left-0 right-0 m-auto z-50 flex p-4 h-modal
        md:h-fit bg-gray-200 w-fit rounded-2xl"
        >
            <button
                on:click={showCreateSession}
                class="absolute top-5 right-5 text-right text-gray-400 hover:text-black"
                >✖</button
            >
            <ul class="h-fit">
                <form on:submit|preventDefault={registerIt}>
                    <li class="m-2">
                        <input
                            class="border-2 border-gray-700 rounded-xl"
                            type="text"
                            name="sname"
                            placeholder=" Session name"
                            v-model="sname"
                            bind:value={session_name}
                        />
                    </li>
                    <li class="m-2">
                        <input
                            class="border-2 border-gray-700 rounded-xl"
                            type="password"
                            name="spw"
                            placeholder=" Password(Optional)"
                            bind:value={session_pw}
                        />
                    </li>
                    {#each usernames as el, index}
                        <li class="m-2">
                            <input
                                class="border-2 border-gray-700 rounded-xl"
                                type="text"
                                placeholder={" Player " + (index + 1)}
                                name={"p" + index}
                                bind:value={el}
                            />
                            <button
                                on:click|preventDefault={lessPlayer}
                                class="text-2xl ml-1 text-gray-400 hover:text-black hover:cursor-pointer"
                                >⊖</button
                            >
                        </li>
                    {/each}
                    <li class="text-2xl ml-1 transition-colors">
                        <button
                            on:click|preventDefault={morePlayer}
                            class="text-2xl ml-1 text-gray-400 hover:text-black hover:cursor-pointer"
                            >⊕</button
                        >
                    </li>
                    <li class="flex justify-center">
                        <button
                            class="text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl bg-gray-500 w-fit self-center"
                            >Create session</button
                        >
                    </li>
                </form>
            </ul>
        </div>
    </div>
{/if}
{:else}
<Session session={currentSession}/>
{/if}
<style>
    .hide-scroll-bar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .hide-scroll-bar::-webkit-scrollbar {
        display: none;
    }
</style>
