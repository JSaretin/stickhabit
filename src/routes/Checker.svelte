<script lang="ts">
	export let day: number;
	export let today: number;
	export let exectDate: number;
	export let checked: boolean;

	let date = new Date(exectDate).toLocaleDateString();
</script>

<button
	title={date}
	on:click
	class={'w-6 aspect-square text-xs font-medium font-mono rounded-sm shrink-0 ' +
		(checked
			? 'bg-green-400 text-black'
			: today > exectDate
				? 'bg-red-700 text-black'
				: 'border text-neutral-700 ' +
					(exectDate > today ? 'border-neutral-500 ' : 'border-orange-600'))}>{day}</button
>
