<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import mapboxgl from 'mapbox-gl'
import useApi from '~/composables/use-api'

export default defineComponent({
  name: 'MapComponent',
  setup(props, ctx) {
    const accessToken = process.env.NUXT_ENV_MAPBOX
      ? process.env.NUXT_ENV_MAPBOX
      : ''
    const { bikes, bikesGeoPoints, fetchBikes } = useApi({ ctx })
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
      let geojson = {
        type: 'FeatureCollection',
        features: [bikesGeoPoints.value],
      }

      geojson.features.map((arr: any) => {
        arr.map((marker: any) => {
          let el = document.createElement('div')
          el.className = 'marker'

          if (marker) {
            console.log('addMarkers -> marker', marker)
            new mapboxgl.Marker(el)
              .setLngLat(marker.geometry.coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                  .setHTML(
                    '<h3>' +
                      marker.properties.title +
                      '</h3><p>' +
                      marker.properties.description +
                      '</p>'
                  )
              )
              .addTo(map)
          }
        })
      })
    }

    onMounted(async () => {
      await fetchBikes().then(() => {
        createMap()
        addMarkers()
      })
    })

    return {
      bikes,
    }
  },
})
</script>

<style>
#map,
.mapboxgl-canvas {
  width: 100%;
  min-height: 50vh;
  border-radius: 0 0 4px 4px;
}

.marker {
  background-image: url('/zoov-bike.svg');
  background-size: cover;
  width: 64px;
  height: 64px;
  cursor: pointer;
}

.mapboxgl-popup {
  max-width: 200px;
}

.mapboxgl-popup-content {
  text-align: center;
  font-family: 'Open Sans', sans-serif;
  color: black;
}
</style>
