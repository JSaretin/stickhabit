<script lang="ts">
	import { getStartOfToday, millisecondsInAday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { createEventDispatcher, onMount } from 'svelte';
	import HabitTicker from './HabitTicker.svelte';

	export let habit: Habit;
	let expand: boolean = true;

	const emiter = createEventDispatcher();
	let choosenIndex: number;

	function sendUpdateAlert(index: number) {
		emiter('update', index);
	}

	function updateChoosenIndex() {
		const todayStart = getStartOfToday();
		const diff = todayStart - habit.start_date;
		choosenIndex = Math.floor(diff / millisecondsInAday);
	}
	onMount(() => {
		updateChoosenIndex();
		setInterval(updateChoosenIndex, 1000);
	});
</script>

<div class="rounded-sm shadow-sm shadow-orange-400">
	<div class="flex flex-col">
		<button on:click={() => (expand = !expand)} class="w-full"
			><h2 class="font-medium text-neutral-300 p-4 font-san w-full text-start flex justify-between">
				{habit.name}
				<HabitTicker
					{...habit}
					{...{ index: choosenIndex, choosenIndex }}
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
				<HabitTicker
					{...habit}
					{...{ index, choosenIndex }}
					on:click={() => sendUpdateAlert(index)}
				/>
			{/each}
		</div>
	{/if}
</div>
