<script lang="ts">
	import type { Habit } from '$lib/structure';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Checker from './Checker.svelte';
	import { millisecondsInAday } from '$lib';

	const daysInCurrentMonth = getContext('daysInCurrentMonth') as Writable<number>;
	const secondsOfLastDayOfCurrentMonth = getContext(
		'secondsOfLastDayOfCurrentMonth'
	) as Writable<number>;

	export let habit: Habit;

	const daysOfTheMonth = Array($daysInCurrentMonth)
		.fill(null)
		.map((_, index) => $secondsOfLastDayOfCurrentMonth - millisecondsInAday * index)
		.reverse();
</script>

<div class="mt-2 flex flex-wrap gap-1 w-full">
	{#each daysOfTheMonth as day, _}
		<Checker {day} bind:checked={habit.checked[day]} />
	{/each}
</div>
