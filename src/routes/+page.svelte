<script lang="ts">
	import { getStartOfToday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { onMount } from 'svelte';
	import RenderHabit from './RenderHabit.svelte';

	let habits: Habit[] = [];
	let loaded = false;
	let currentHabit = '';
	let showpopup = false;
	let position: number;

	$: loaded && localStorage.setItem('habits', JSON.stringify(habits));

	function addHabit() {
		habits = [
			...habits,
			{
				id: crypto.randomUUID(),
				description: currentHabit,
				checked: {},
				start_date: getStartOfToday()
			}
		];
		currentHabit = '';
		togglepopup();
	}

	function togglepopup() {
		showpopup = !showpopup;
	}

	onMount(() => {
		habits = JSON.parse(localStorage.getItem('habits') || '[]');
		loaded = true;
	});

	function updatehabit(habit: Habit) {
		habits = habits.map((h) => {
			return h.id === habit.id ? habit : h;
		});
	}

	let habitToEdit: Habit | undefined;

	function toggleedithabit(habit: Habit) {
		(position as any) = undefined;
		habitToEdit = habit;
	}

	function edithabit() {
		habits = habits.map((h) => {
			return h.id === habitToEdit!.id ? habitToEdit! : h;
		});
		habitToEdit = undefined;
	}

	function deletehabit() {
		habits = habits.filter((h) => {
			return h.id === habitToEdit!.id ? false : true;
		});
		habitToEdit = undefined;
	}

	function changePosition() {
		let tempHabits = habits;
		// Find the current index of the habit to edit
		const currentIndex = tempHabits.indexOf(habitToEdit!);
		let newIndex = Number(position) - 1;

		if (currentIndex === -1) {
			console.error('Habit to edit not found in the list.');
			return;
		}

		// Remove the habit from its current position
		tempHabits.splice(currentIndex, 1);

		// Insert the habit at the new position
		tempHabits.splice(newIndex, 0, habitToEdit!);
		habits = tempHabits;
		habitToEdit = undefined;
	}
</script>

{#if showpopup}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click|self={togglepopup}
		class="fixed inset-0 z-20 bg-neutral-900 bg-opacity-95 backdrop-blur-sm flex align-middle justify-center place-items-center"
	>
		<div class="max-w-md w-full flex-col flex gap-2 p-2 rounded-md border border-neutral-600">
			<textarea
				class="p-2 rounded-md resize-none bg-neutral-600 border-none outline-none text-white"
				placeholder="Enter your new habit"
				bind:value={currentHabit}
			></textarea>
			<button on:click={addHabit} class="p-2 border font-bold text-sm text-white rounded-md"
				>Add Habit</button
			>
		</div>
	</div>
{/if}

{#if habitToEdit !== undefined}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click|self={() => {
			habitToEdit = undefined;
		}}
		class="fixed inset-0 z-20 bg-neutral-900 bg-opacity-95 backdrop-blur-sm flex align-middle justify-center place-items-center"
	>
		<div class="max-w-md w-full flex-col flex gap-2 p-2 rounded-md border border-neutral-600">
			<textarea
				class="p-2 rounded-md resize-none bg-neutral-600 border-none outline-none text-white"
				placeholder="Enter your new habit"
				bind:value={habitToEdit.description}
			></textarea>
			<div class="flex gap-2">
				<button
					on:click={edithabit}
					class="p-2 flex-1 border font-bold text-sm text-white rounded-md">Update Habit</button
				>
				<button
					on:click={deletehabit}
					class="p-2 border font-bold text-sm flex-1 text-red-500 rounded-md border-red-500"
					>Delete Habit</button
				>
			</div>
			<div class="flex flex-col mt-4 text-white gap-2">
				Change Position
				<div class="flex w-full rounded-md overflow-hidden">
					<input
						type="text"
						bind:value={position}
						class="p-2 flex-1 border-none outline-none bg-neutral-600 text-white"
					/>
					<button on:click={changePosition} class="p-2 bg-green-500">Update</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<button
	on:click={togglepopup}
	class="fixed font-mono bottom-6 right-6 w-10 h-10 flex justify-center align-middle place-items-center"
>
	<div class="w-full h-full rounded-full bg-green-400 text-white text-5xl font-bold">+</div>
</button>

<div class="h-screen w-full flex">
	<div class="flex-1 flex flex-col text-white overflow-y-scroll">
		{#each habits as habit, index (habit.id)}
			<RenderHabit
				index={index + 1}
				on:click={() => toggleedithabit(habit)}
				on:updatehabit={() => updatehabit(habit)}
				{habit}
			/>
		{/each}
	</div>
</div>
