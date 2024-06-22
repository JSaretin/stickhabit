<script lang="ts">
	export let index: number;
	export let completed: boolean;
	export let choosenIndex: number;
</script>

<button
	disabled={index !== choosenIndex}
	class={'w-3 h-3 rounded-sm ' +
		(completed
			? 'bg-green-400'
			: index === choosenIndex
				? 'bg-neutral-800 border border-orange-400'
				: 'bg-neutral-800')}
	on:click
></button>
