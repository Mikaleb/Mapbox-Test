<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import mapboxgl from 'mapbox-gl'

export default defineComponent({
  name: 'MapComponent',
  setup(props, ctx) {
    const accessToken = process.env.NUXT_ENV_MAPBOX
      ? process.env.NUXT_ENV_MAPBOX
      : ''
    let map: any = null

    const createMap = () => {
      map = new mapboxgl.Map({
        accessToken: accessToken,
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 10,
        center: [2.3522219, 48.856614],
      })
    }

    const addMarkers = () => {
      var marker = new mapboxgl.Marker()
        .setLngLat([2.3522219, 48.856614])
        //@ts-ignore
        .addTo(map)
    }

    onMounted(() => {
      createMap()
      addMarkers()
    })

    return {
      createMap,
      addMarkers,
    }
  },
})
</script>

<style scoped>
#map,
.mapboxgl-canvas {
  width: 100%;
  min-height: 50vh;
  border-radius: 0 0 4px 4px;
}
</style>
