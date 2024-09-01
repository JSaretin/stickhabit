<script>
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		if ('serviceWorker' in navigator) {
			console.log('Service Worker is supported, registering service worker');
			navigator.serviceWorker.register('/service-worker.js');
		}
	});
</script>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.neutral.800);
		font-family: theme(fontFamily.Kodchasan);
	}
</style>
