<script lang="ts">
	import { calculateMilliSecondes, getCurrentTime, getIsToday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { createEventDispatcher, onMount } from 'svelte';

	export let index: number;
	export let habit: Habit;

	let execttime: number;
	let isToday: boolean;

	const days = calculateMilliSecondes(habit, index);

	const emiter = createEventDispatcher();
	let disabled: boolean;

	function setIsDisabled() {
		isToday = getIsToday(execttime);

		const now = getCurrentTime();
		disabled = !isToday || now < execttime;
	}

	function processDone() {
		habit.completed[index] = !habit.completed[index];
		if (!habit.completed[index]) {
			delete habit.completed[index];
		}
		emiter('update');
	}

	onMount(() => {
		execttime = days + habit.start_date;
		setIsDisabled();
		setInterval(setIsDisabled, 1000);
	});
</script>

<button
	title={new Date(execttime).toString()}
	class={'w-3 aspect-square rounded-sm ' +
		(habit.completed[index] !== undefined
			? 'bg-green-400'
			: isToday
				? 'border border-orange-400'
				: 'bg-neutral-800')}
	{disabled}
	on:click={processDone}
></button>
