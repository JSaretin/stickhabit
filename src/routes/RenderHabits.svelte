<script lang="ts">
	import type { Habit } from '$lib/structure';
	import RenderHabit from './RenderHabit.svelte';
	export let habits: Habit[];
</script>

<div class="flex-1 flex w-full flex-col text-white">
	{#each habits as habit, index (habit.id)}
		<RenderHabit isTopLevel={false} bind:habit={habits[index]} />
	{/each}
</div>
