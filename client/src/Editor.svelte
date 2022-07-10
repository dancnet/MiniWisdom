<script>
	import {onMount, createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { mode } from './store.js';

    export let snippet = null;
    export let question = null;

	import Quill from "quill";
	import "../node_modules/quill/dist/quill.bubble.css";

	import Fa from 'svelte-fa/src/fa.svelte'
	import { faSave, faEdit, faTrash, faLightbulb, faWindowClose } from '@fortawesome/free-solid-svg-icons/index.es'

	let quill;
    let quillContainer;

	onMount(() => {
		quill = new Quill(quillContainer, {
			modules: {
				// toolbar: [
				// 	[{ header: [1, 2, 3, false] }],
				// 	["bold", "italic", "underline", "strike"],
				// 	["link", "code-block"]
				// ]
			},
			placeholder: "Type something...",
			theme: "bubble"
		});
        quill.root.innerHTML = snippet !== null ? snippet.content : question.content;
	});

	const save = () => {
        if (snippet !== null) {
            fetch('/api/snippets/' + snippet.id, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    content: quill.root.innerHTML
                })
            })
            .then(response => response.json())
            .then(data => {if(data.content) alert('Saved!')});
        } else {
            fetch('/api/questions/' + question.id, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    content: quill.root.innerHTML
                })
            })
            .then(response => response.json())
            .then(data => {if(data.content) alert('Saved!')});
        }
    };

    const editQuestions = () => {
        mode.set(2);
        dispatch('editQuestions', {id: snippet.id, location: snippet.location, content: quill.root.innerHTML});
    };

    const remove = () => {
        if (confirm('Are you sure you want to remove this?')) {
            if (snippet !== null) dispatch('remove_snippet', snippet.id);
            else dispatch('remove_question', question.id);
        }
    }

    $: allow_editQuestion = snippet !== null && $mode < 2;
    $: allow_remove = $mode < 2 || (question !== null && $mode === 2);
</script>

<div class="w3-section w3-card w3-border w3-border-brown rounded" class:hidden={snippet !== null && $mode === 3}>
	<div bind:this={quillContainer} />
    <div class="w3-center w3-border-top w3-border-brown {snippet !== null ? 'w3-pale-yellow' : 'w3-pale-blue'}">
        <button class="w3-button w3-text-brown w3-hover-none w3-hover-text-orange" on:click={save}><Fa icon={faSave} /></button>
        {#if allow_editQuestion}<button class="w3-button w3-text-brown w3-hover-none w3-hover-text-orange" on:click={editQuestions}><Fa icon={faLightbulb} /></button>{/if}
        {#if allow_remove}<button on:click={remove} class="w3-button w3-text-brown w3-hover-none w3-hover-text-orange"><Fa icon={faTrash} /></button>{/if}
    </div>
</div>

<style>
    .rounded {
        border-radius: 8px 8px 0 0;
    }
    .hidden {
        opacity: 0;
    }
    .hidden:hover {
        opacity: 1;
    }
</style>