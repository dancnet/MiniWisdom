<script>
	import Navigation from './Navigation.svelte';
	import Editor from './Editor.svelte';
	import { mode } from './store.js';

	let loading = true;
	let snippets = [];
	let questions = [];
	let snippet_question = null;
	const getSnippets = (request) => {
		loading = true;
		snippets = [];
		fetch('/api/snippets?' + new URLSearchParams(request))
		.then(response => response.json())
		.then(data => {
			snippets = data;
			loading = false;
		});
	}
	getSnippets({location: ''});

	const add = (event) => {
		if ($mode === 0) {
			fetch('/api/snippets', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					location: event.detail
				})
			})
			.then(response => response.json())
			.then(data => {
				if(data) snippets = [...snippets, {id: data.id, location: event.detail, content: ''}];
				else alert('Something went wrong when trying to add a new snippet.');
			});
		} else {
			fetch('/api/questions', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					snippet: snippet_question.id
				})
			})
			.then(response => response.json())
			.then(data => {
				if(data) questions = [...questions, {id: data.id, snipppet: snippet_question.id, content: ''}];
				else alert('Something went wrong when trying to add a new question.');
			});
		}
	}

	const editQuestions = (event) => {
		loading = true;
		snippet_question = event.detail;
		fetch('/api/questions?' + new URLSearchParams({snippet: snippet_question.id}))
		.then(response => response.json())
		.then(data => {
			questions = data;
			loading = false;
		});
	}

	const learn = (event) => {
		loading = true;
		fetch('/api/learn?' + new URLSearchParams(event.detail))
		.then(response => response.json())
		.then(data => {
			questions = [{
				id: data.question_id,
				snippet: data.snippet_id,
				content: data.question_content
			}];
			snippet_question = {
				id: data.snippet_id,
				location: data.location,
				content: data.snippet_content
			};
			loading = false;
		});
	}

	const remove_snippet = event => {
		fetch('/api/snippets/' + event.detail, {
			method: 'DELETE'
		})
		.then(response => response.json())
		.then(data => {
			if(data) snippets = [...snippets.filter(snippet => snippet.id !== event.detail)];
			else alert('Something went wrong when trying to delete the snippet.');
		});
	}
	const remove_question = event => {
		fetch('/api/questions/' + event.detail, {
			method: 'DELETE'
		})
		.then(response => response.json())
		.then(data => {
			if(data) questions = [...questions.filter(question => question.id !== event.detail)];
			else alert('Something went wrong when trying to delete the question.');
		});
	}
</script>

<div class="bar w3-pale-yellow">
	<Navigation on:navigate={event => getSnippets(event.detail)} on:learn={learn} on:add={add} />
</div>
{#if !loading}
	<div class="w3-container">
		{#if $mode < 2}
			{#each snippets as snippet (snippet.id)}
				<Editor {snippet} on:editQuestions={editQuestions} on:remove_snippet={remove_snippet} />
			{:else}
				<div class="w3-section w3-center">Nothing to show...</div>
			{/each}
		{:else if $mode === 2}
			<Editor snippet={snippet_question} />
			{#each questions as question (question.id)}
				<Editor {question} on:remove_question={remove_question} />
			{:else}
				<div class="w3-section w3-center">Nothing question to show...</div>
			{/each}
		{:else}
			<Editor question={questions[0]} />
			<Editor snippet={snippet_question} />
		{/if}
	</div>
{/if}

<style>
.bar {
	position: sticky;
	top: 0;
	z-index: 1;
}
</style>