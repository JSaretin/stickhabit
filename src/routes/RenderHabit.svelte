<script lang="ts">
	import { getStartOfToday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { createEventDispatcher, onMount } from 'svelte';
	import HabitTicker from './HabitTicker.svelte';

	const emiter = createEventDispatcher();
	export let habit: Habit;
	let choosenIndex: number;

	function sendUpdateAlert(index: number) {
		emiter('update', index);
	}

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
	<div class="flex flex-col">
		<button on:click={() => (expand = !expand)} class="w-full"
			><h2 class="font-medium text-neutral-300 p-4 font-san w-full text-start flex justify-between">
				{habit.name}

				<HabitTicker
					bind:habit
					bind:index={choosenIndex}
					on:click={() => {
						expand = !expand;
						sendUpdateAlert(choosenIndex);
					}}
				/>
			</h2></button
		>
		<div class="flex justify-between p-4 pt-0 text-neutral-400 text-sm font-medium">
			Start date
			<div class="text-green-400">{new Date(habit.start_date).toLocaleDateString()}</div>
		</div>
	</div>

	{#if expand}
		<div class="flex gap-1 flex-wrap p-4 pt-0">
			{#each Array(365).fill(null) as _, index}
				<HabitTicker bind:habit {index} bind:choosenIndex on:click={() => sendUpdateAlert(index)} />
			{/each}
		</div>
	{/if}
</div>
