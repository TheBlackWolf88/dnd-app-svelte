<script lang="ts">
    import { currentUser, pb } from "./pocketbase";

    let username: string;
    let password: string;
    let canRegState: boolean = false;
    let buttonText: string = "Login";
    let regText: string = "Not having an account? Cringe. Make one.";
    let hovered: boolean = false
    async function login() {
        await pb.collection("users").authWithPassword(username, password);
    }

    function signOut() {
        pb.authStore.clear();
    }

    async function signUp() {
        try {
            const data = {
                username,
                password,
                passwordConfirm: password,
            };
            console.log(data);
            const createdUser = await pb.collection("users").create(data);
            await login();
        } catch (e) {
            console.error(e);
        }
    }

    function changeState() {
        if (canRegState) {
            canRegState = false;
            buttonText = "Login";
            regText = "Not having an account? Cringe. Make one.";
        } else {
            canRegState = true;
            buttonText = "Register";
            regText = "Back to Login";
        }
    }
    function onHover(){
        hovered ? hovered = false : hovered=true
    }
</script>

<div class="bg-gray-300 p-10 rounded-lg flex justify-center">
    {#if $currentUser}
        <p class="text-2xl font-bold text-green-800">
            Signed in as {$currentUser.username}
        </p>
        <button on:click={signOut}>Sign Out</button>
    {:else}
        <div>
            <ul>
                <form on:submit|preventDefault>
                <li class="flex justify-center"><img src="src/assets/userOwn.png" alt="" class="h-28 w-auto" /></li>
                    <li class="m-2 flex justify-center">
                        <input
                            type="text"
                            placeholder="Username"
                            bind:value={username}
                        />
                    </li>

                    <li class="m-2 flex justify-center">
                        <input
                            type="password"
                            placeholder="Password"
                            bind:value={password}
                        />
                    </li>
                    <li class="flex justify-center mb-2">
                        <button
                            on:click={canRegState ? signUp : login}
                            class="text-gray-200 border-2 border-gray-700 px-5 py-2 mt-2 mb-0 rounded-xl {canRegState ? 'bg-blue-500' : 'bg-green-600'}"
                            >{buttonText}</button
                        >
                    </li>
                    <li class="text-center">
                        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                        <button on:click={changeState} on:mouseover={onHover} on:mouseout={onHover} class="{hovered ? 'underline' : ''} {hovered ? 'cursor-pointer' : ''} text-blue-500">{regText}</button>
                    </li>
                </form>
            </ul>
        </div>
    {/if}
</div>
