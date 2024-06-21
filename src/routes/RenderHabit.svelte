<script lang="ts">
	import { getStartOfToday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { onMount } from 'svelte';
	import HabitTicker from './HabitTicker.svelte';

	export let habit: Habit;
	let choosenIndex: number;

	function updateChoosenIndex() {
		const todayStart = getStartOfToday();
		const diff = todayStart - habit.start_date;

		choosenIndex = Math.floor(diff / 86400000);
	}
	onMount(() => {
		updateChoosenIndex();
		setInterval(updateChoosenIndex, 1000);
	});
	let expand: boolean = true;
</script>

<div class="rounded-md shadow-sm shadow-orange-400">
	<button on:click={() => (expand = !expand)} class="w-full"
		><h2 class="font-medium text-neutral-300 p-4 font-san w-full text-start flex justify-between">
			{habit.name}
			<!-- <span>{habit.start_time}</span> -->
		</h2></button
	>
	{#if expand}
		<div class="flex gap-1 flex-wrap p-4 pt-0">
			{#each Array(365).fill(null) as _, index}
				{#if index == choosenIndex}
					<HabitTicker bind:habit {index} on:update />
				{:else}
					<button
						title={new Date(habit.start_date + 86400000 * index).toString()}
						class="w-3 aspect-square rounded-sm bg-neutral-800"
						disabled
					></button>
				{/if}
			{/each}
		</div>
	{/if}
</div>
