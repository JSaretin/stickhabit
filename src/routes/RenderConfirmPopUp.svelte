<script lang="ts">
	import type { Habit } from '$lib/structure';
	import { createEventDispatcher } from 'svelte';

	const emiter = createEventDispatcher();
	export let habit: Habit;
	export let popTaskIndex: number;
	let taskDone = habit.completed[popTaskIndex];
</script>

<div
	class="fixed p-4 inset-0 bg-neutral-900 z-[100] bg-opacity-50 flex justify-center align-middle place-items-center"
>
	<div
		class="max-w-sm w-full rounded-sm overflow-hidden bg-neutral-900 shadow-sm shadow-orange-500"
	>
		<h2 class="text-md p-2 text-center uppercase font-bold bg-orange-400">
			Have you completed this habit?
		</h2>

		<div class="my-4 w-full text-center text-neutral-400 text-lg p-2">
			{habit.name}
		</div>

		<div class="p-2">
			<div class="flex gap-2 w-full">
				<button
					class={'p-2 flex-1 rounded-sm ' + (taskDone ? 'bg-green-500' : 'bg-red-500')}
					on:click={() => emiter('cancle')}>{taskDone ? 'Yes' : 'No'}</button
				>
				<button
					class={'p-2 flex-1 rounded-sm ' + (taskDone ? 'bg-red-500' : 'bg-green-500')}
					on:click>{taskDone ? 'No' : 'Yes'}</button
				>
			</div>
		</div>
	</div>
</div>
