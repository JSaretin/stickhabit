<script lang="ts">
	// import { getIsToday, getStartOfToday, millisecondsInAday } from '$lib';
	import type { Habit } from '$lib/structure';
	import RenderHabits from './RenderHabits.svelte';
	import Calender from './Calender.svelte';
	import Checker from './Checker.svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const today: number = getContext('today');
	const expand: Writable<boolean> = getContext('expand');
	let expanded = $expand;

	const dispatcher = createEventDispatcher();

	export let habit: Habit;
	export let isTopLevel = true;

	function toggleCheck(e: { detail: boolean }) {
		if (!e.detail) {
			habit.habits = habit.habits.map((h) => {
				h.checked[today] = e.detail;
				return h;
			});
		}
		dispatcher('togglecheck', e.detail);
	}
</script>

<div
	class={'flex flex-col w-full place-items-center p-2 rounded-md border border-neutral-700 ' +
		(isTopLevel ? '  ' : ' mt-2')}
>
	<div class="flex justify-between text-neutral-100 font-medium text-sm w-full">
		<button
			on:click={() => {
				expanded = !expanded;
			}}
			class="text-base text-left">{habit.description}</button
		>
		<div class="">
			<Checker
				day={today}
				bind:checked={habit.checked[today]}
				startDay={today}
				on:togglecheck={toggleCheck}
			/>
		</div>
	</div>
	{#if expanded || $expand}
		<Calender bind:habit on:togglecheck />
	{/if}

	{#if (habit.checked[today] || $expand) && habit.habits.length > 0}
		<RenderHabits bind:habits={habit.habits} on:togglecheck />
	{/if}
</div>
