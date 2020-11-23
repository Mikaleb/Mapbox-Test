<template>
  <div class="zds">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <div style="margin-top: 10vh;" class="pa-3">
          <z-card>
            <map-container />
          </z-card>
        </div>
        <bikes-list />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MapContainer from '~/components/MapContainer.vue'
import { ZCard } from '@zoov/design-system/src/components/ZCard'
import BikesList from '~/components/BikesList.vue'

export default {
  name:'Index',
  components: {
    MapContainer,
    ZCard,
    BikesList
  }
}
</script>
