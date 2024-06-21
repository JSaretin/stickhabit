<script lang="ts">
	import { convertToMilliseconds, getCurrentTime } from '$lib';
	import type { Habit } from '$lib/structure';
	import { createEventDispatcher, onMount } from 'svelte';

	export let index: number;
	export let habit: Habit;
	export let execttime: number;
	export let today: number;

	const emiter = createEventDispatcher();
	let disabled: boolean;

	function setIsDisabled() {
		const now = getCurrentTime();
		disabled = now < execttime;
	}

	function processDone() {
		habit.completed[index] = !habit.completed[index];
		if (!habit.completed[index]) {
			delete habit.completed[index];
		}
		emiter('update');
	}

	onMount(() => {
		setIsDisabled();
		setInterval(setIsDisabled, 1000);
	});
</script>

<button
	title={new Date(execttime).toString()}
	class={'w-3 aspect-square rounded-sm ' +
		(habit.completed[index] !== undefined
			? 'bg-green-400'
			: execttime - convertToMilliseconds(habit.start_time) == today
				? 'border border-orange-400'
				: 'bg-neutral-800')}
	{disabled}
	on:click={processDone}
></button>
