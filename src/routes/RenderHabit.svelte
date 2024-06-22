<script lang="ts">
	import { getCurrentTime, getStartOfToday, millisecondsInAday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { createEventDispatcher, onMount } from 'svelte';
	import HabitTicker from './HabitTicker.svelte';

	export let habit: Habit;
	let expand: boolean = true;
	let currentMilliseconds: number;

	const emiter = createEventDispatcher();
	let choosenIndex: number;

	function sendUpdateAlert(index: number) {
		emiter('update', index);
	}

	function updateChoosenIndex() {
		currentMilliseconds = getCurrentTime();
		const todayStart = getStartOfToday();
		const diff = todayStart - habit.start_date;
		choosenIndex = Math.floor(diff / millisecondsInAday);
	}
	onMount(() => {
		updateChoosenIndex();
		setInterval(updateChoosenIndex, 1000);
	});

	let wantToEditName = false;

	function toggleWantToEditName() {
		wantToEditName = !wantToEditName;
	}
</script>

<div class="rounded-sm shadow-sm shadow-orange-400">
	<div class="flex flex-col">
		<div class="relative flex overflow-x-scroll">
			<div class="shrink-0 w-full">
				<button on:click={() => (expand = !expand)} class="shrink-0 w-full"
					><h2
						class="font-medium text-neutral-300 p-4 font-san w-full text-start flex justify-between"
					>
						{habit.name}
						<HabitTicker
							{...habit}
							bind:index={choosenIndex}
							bind:choosenIndex
							on:click={() => {
								expand = !expand;
								sendUpdateAlert(choosenIndex);
							}}
						/>
					</h2>
				</button>
				<div class="flex justify-between p-4 pt-0 text-neutral-400 text-sm font-medium">
					Start date
					<div class="text-green-400">{new Date(habit.start_date).toLocaleDateString()}</div>
				</div>
			</div>

			{#if !expand}
				<div class="shrink-0 w-full flex flex-col relative p-2">
					{#if wantToEditName}
						<div class="absolute inset-0 bg-neutral-900 flex">
							<div class="flex flex-1">
								<textarea
									rows="1"
									bind:value={habit.name}
									class="flex-1 bg-neutral-800 text-white rounded-l-sm rounded-r-sm md:rounded-r-none p-2 resize-none border-none outline-none"
								></textarea>
								<input
									class="w-fit bg-neutral-800 text-neutral-100 border-none outline-none"
									type="time"
									bind:value={habit.start_time}
								/>
							</div>
							<button
								disabled={!Boolean(habit.name) || !Boolean(habit.name.replaceAll(' ', ''))}
								class="p-2 rounded-l-sm md:rounded-l-none bg-blue-500 rounded-r-sm"
								on:click={() => {
									emiter('updatename');
									toggleWantToEditName();
								}}>update</button
							>
						</div>
					{/if}
					<div class="text-neutral-700">
						<button on:click={toggleWantToEditName}
							>{wantToEditName ? 'cancle edit' : 'edit habit'}</button
						>
					</div>
				</div>
			{/if}
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
