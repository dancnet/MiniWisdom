<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import Fa from 'svelte-fa/src/fa.svelte'
	import { faAsterisk, faSearch, faDice, faLightbulb, faPlus } from '@fortawesome/free-solid-svg-icons/index.es';

    import { mode } from './store.js';

    let navigationBox = '';
    let navigationBoxOld = navigationBox;

    let locations = [];
    fetch('/api/locations')
    .then(response => response.json())
    .then(data => locations = data);

    const location = () => {
        mode.set(0);
        dispatch('navigate', {location: navigationBox});
        navigationBoxOld = navigationBox;
    }
    const locationLike = () => {
        mode.set(1);
        dispatch('navigate', {locationLike: navigationBox});
        navigationBoxOld = navigationBox;
    }
    const contentLike = () => {
        mode.set(1);
        dispatch('navigate', {contentLike: navigationBox});
        navigationBoxOld = navigationBox;
    }
    const random = () => {
        mode.set(1);
        dispatch('navigate', {random: navigationBox});
        navigationBoxOld = navigationBox;
    }
    const learn = () => {
        mode.set(3);
        dispatch('learn', {locationLike: navigationBox});
        navigationBoxOld = navigationBox;
    }
    const add = () => {
        let addSnippet = $mode === 0;
        dispatch('add', addSnippet ? navigationBox : '');
        if(addSnippet && navigationBox !== '' && !locations.includes(navigationBox)) locations = [...locations, navigationBox];
    }

    $: allow_add = ($mode === 0 || $mode === 2) && navigationBoxOld === navigationBox;
</script>

<form on:submit|preventDefault={location} class="w3-bar w3-card w3-border-bottom w3-border-brown bar">
    <input list="locations" bind:value={navigationBox} type="text" class="w3-bar-item w3-input w3-pale-yellow" placeholder="Navigate">
    <datalist id="locations">
        {#each locations as location(location)}
            <option value={location}>
        {/each}
    </datalist>
    <button type="button" on:click={locationLike} class="w3-bar-item w3-button w3-text-brown w3-hover-none w3-hover-text-orange"><Fa icon={faAsterisk} /></button>
    <button type="button" on:click={contentLike} class="w3-bar-item w3-button w3-text-brown w3-hover-none w3-hover-text-orange"><Fa icon={faSearch} /></button>
    <button type="button" on:click={random} class="w3-bar-item w3-button w3-text-brown w3-hover-none w3-hover-text-orange"><Fa icon={faDice} /></button>
    <button type="button" on:click={learn} class="w3-bar-item w3-button w3-text-brown w3-hover-none w3-hover-text-orange"><Fa icon={faLightbulb} /></button>
    <button type="button" on:click={add} class="w3-bar-item w3-button w3-text-brown w3-hover-none w3-hover-text-orange" disabled={!allow_add}><Fa icon={faPlus} /></button>
</form>

<style>
    .bar {
        display: flex;
    }
    .bar > input {
        flex-grow: 1;
    }
</style>