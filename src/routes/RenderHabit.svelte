<script lang="ts">
	import { getIsToday, getStartOfToday, millisecondsInAday } from '$lib';
	import type { Habit } from '$lib/structure';
	import RenderHabits from './RenderHabits.svelte';
	import Calender from './Calender.svelte';
	import Checker from './Checker.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const today: number = getContext('today');
	const expand: Writable<boolean> = getContext('expand');
	let expanded = $expand;

	export let habit: Habit;
	export let isTopLevel = true;
</script>

<div
	class={'flex flex-col w-full place-items-center p-2 rounded-md border border-neutral-700 ' +
		(isTopLevel ? '  ' : ' mt-2')}
>
	<div
		class="flex justify-between text-neutral-100 text-left font-medium text-sm w-full whitespace-nowrap overflow-x-scroll"
	>
		<button
			on:click={() => {
				expanded = !expanded;
			}}
			class="text-base">{habit.description}</button
		>
		<div class="">
			<Checker
				day={today}
				bind:checked={habit.checked[today]}
				on:toggleCheck={(e) => {
					if (!e.detail) {
						habit.habits = habit.habits.map((h) => {
							h.checked[today] = false;
							return h;
						});
					}
				}}
			/>
		</div>
	</div>
	{#if expanded || $expand}
		<Calender bind:habit />
	{/if}

	{#if habit.checked[today] && habit.habits.length > 0}
		<RenderHabits bind:habits={habit.habits} />
	{/if}
</div>
