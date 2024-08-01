<script lang="ts">
	export let day: number;
	export let today: number;
	export let exectDate: number;
	export let checked: boolean;

	let isToday = today == exectDate;
</script>

<button
	on:click
	disabled={!isToday}
	class={'w-6 aspect-square text-xs font-medium font-mono rounded-sm shrink-0 ' +
		(checked
			? 'bg-green-400 text-black'
			: today > exectDate
				? 'bg-red-700 text-black'
				: 'border ' +
					(exectDate > today
						? 'border-neutral-500 text-neutral-700'
						: 'border-green-600 text-green-400 '))}>{day}</button
>
