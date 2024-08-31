<script lang="ts">
	import { millisecondsInAday } from '$lib';
	import { createEventDispatcher, getContext } from 'svelte';

	const today: number = getContext('today');
	const tomorrowStart = today + millisecondsInAday;

	export let day: number;
	export let checked: boolean;

	const dispatcher = createEventDispatcher();
	function toggleCheck() {
		checked = !checked;
		dispatcher('toggleCheck', checked);
	}
</script>

<button
	title={new Date(day).toLocaleDateString()}
	on:click={toggleCheck}
	class={'w-5 aspect-square text-xs font-medium font-mono rounded-sm shrink-0  ' +
		(checked
			? 'bg-green-400 text-black'
			: today > day
				? 'bg-neutral-700 text-black'
				: 'border text-neutral-700 ' + (day > today ? 'border-neutral-500 ' : 'border-orange-600'))}
>
	<!-- {day}
	{today} -->
</button>
