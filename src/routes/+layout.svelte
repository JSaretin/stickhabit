<script>
	import '../app.css';
</script>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.neutral.800);
		font-family: theme(fontFamily.Kodchasan);
	}
</style>
