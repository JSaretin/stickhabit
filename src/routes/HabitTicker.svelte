<script lang="ts">
	import type { Habit } from '$lib/structure';

	export let index: number;
	export let habit: Habit;
	export let choosenIndex: number;
</script>

<button
	disabled={index !== choosenIndex}
	class={'w-4 h-4 rounded-sm ' +
		(habit.completed[index] !== undefined
			? 'bg-green-400'
			: index === choosenIndex
				? 'bg-neutral-800 border border-orange-400'
				: 'bg-neutral-800')}
	on:click
></button>
