<script lang="ts">
	import { convertToMilliseconds, millisecondsInAday } from '$lib';

	export let index: number;
	export let completed: { [key: string]: boolean };
	export let choosenIndex: number;
	export let start_date: number;
	export let start_time: string;
	export let currentMilliseconds: number;

	const execDate = new Date(
		start_date + millisecondsInAday * index + convertToMilliseconds(start_time)
	);
</script>

<button
	title={execDate.toString()}
	disabled={currentMilliseconds < execDate.getTime()}
	class={'w-3 h-3 rounded-sm shrink-0 ' +
		(completed[index]
			? 'bg-green-400'
			: index === choosenIndex
				? 'bg-neutral-800 border border-orange-400'
				: 'bg-neutral-800')}
	on:click
></button>
