<script lang="ts">
	import { Bar, getElementAtEvent } from 'svelte-chartjs'
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
	export let chartData: number[]
	let chart: any

	const data = {
		labels: Array.from({ length: 6 }, (_, i) => i + 1),
		datasets: [
			{
				label: 'number of posts',
				data: chartData,
				backgroundColor: [
					'rgba(255, 134,159,0.4)',
					'rgba(98,  182, 239,0.4)',
					'rgba(255, 218, 128,0.4)',
					'rgba(113, 205, 205,0.4)',
					'rgba(170, 128, 252,0.4)',
					'rgba(255, 177, 101,0.4)',
				],
				borderWidth: 2,
				borderColor: [
					'rgba(255, 134, 159, 1)',
					'rgba(98,  182, 239, 1)',
					'rgba(255, 218, 128, 1)',
					'rgba(113, 205, 205, 1)',
					'rgba(170, 128, 252, 1)',
					'rgba(255, 177, 101, 1)',
				],
			},
		],
	}

	function onClick(event: Event) {
		if (!chart) {
			return
		}
		const element = getElementAtEvent(chart, event as PointerEvent)
		if (!element.length) return
		const { index } = element[0]
		goto(`${$page.params.uid}/posts-level/${data.labels[index]}`)
	}
</script>

<Bar bind:chart {data} on:click={onClick} options={{ responsive: true }} />
