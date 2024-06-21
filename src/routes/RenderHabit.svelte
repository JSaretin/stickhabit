<script lang="ts">
	import { calculateMilliSecondes, convertToMilliseconds, getStartOfToday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { onMount } from 'svelte';
	import HabitTicker from './HabitTicker.svelte';

	export let habit: Habit;
	let expand: boolean = true;

	let today = getStartOfToday();
	onMount(() => {
		setInterval(() => {
			today = getStartOfToday();
		}, 1000);
	});
</script>

<div class="rounded-md shadow-sm shadow-orange-400">
	<button on:click={() => (expand = !expand)} class="w-full"
		><h2 class="font-medium text-white p-4 font-san w-full flex justify-between">
			{habit.name} <span>{habit.start_time}</span>
		</h2></button
	>
	{#if expand}
		<div class="flex gap-1 flex-wrap p-4 pt-0">
			{#each Array(365).fill(null) as _, index}
				<HabitTicker
					bind:today
					execttime={calculateMilliSecondes(habit, index)}
					bind:habit
					{index}
					on:update
				/>
			{/each}
		</div>
	{/if}
</div>
