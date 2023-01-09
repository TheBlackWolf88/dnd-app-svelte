<script lang="ts">
    import {currentUser, pb} from './pocketbase'

    let username : string
    let password : string

    async function login() {
       await pb.collection('users').authWithPassword(username, password) 
    }

    function signOut() {
        pb.authStore.clear()
    }

    async function signUp(){
        try {
            const data = {
                username,
                password,
                passwordConfirm: password
            }
            console.log(data)
            const createdUser = await pb.collection('users').create(data)
            await login()
        }
        catch(e){
            console.error(e)
        }
    }
</script>

{#if $currentUser}
    <p>Signed in as {$currentUser.username}</p>
    <button on:click={signOut}>Sign Out</button>
{:else}
    <form on:submit|preventDefault>
        <input type="text" placeholder="Username" bind:value={username}>
        <input type="password" placeholder="Password" bind:value={password}>

        <button on:click={login}>Login</button>
        <button on:click={signUp}>Sign Up</button>
    </form>
{/if}