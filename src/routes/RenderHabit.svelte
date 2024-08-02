<script lang="ts">
	import { getIsToday, getStartOfToday, millisecondsInAday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { createEventDispatcher } from 'svelte';
	import Checker from './Checker.svelte';

	export let habit: Habit;
	export let index: number;
	const emiter = createEventDispatcher();

	let today = getStartOfToday();

	function toggleCheck(day: number) {
		if (!getIsToday(habit.start_date + day * millisecondsInAday)) return;
		habit.checked[day] = !habit.checked[day];
		emiter('updatehabit');
	}
</script>

<div class="flex w-full align-middle border-b border-neutral-600 place-items-center">
	<span
		class="text-neutral-500 w-[30px] text-sm flex justify-center align-middle place-items-center"
		>{index}</span
	>
	<div
		class="max-w-md text-neutral-100 text-left font-medium text-sm w-full border-r border-neutral-600 p-1 whitespace-nowrap overflow-x-scroll"
	>
		<button on:click>{habit.description}</button>
	</div>
	<div class=" flex-1 p-1 flex gap-1 overflow-x-scroll">
		{#each Array(356) as _, i}
			<Checker
				day={i + 1}
				{today}
				exectDate={habit.start_date + i * millisecondsInAday}
				checked={habit.checked[i]}
				on:click={() => {
					toggleCheck(i);
				}}
			/>
		{/each}
	</div>
</div>
