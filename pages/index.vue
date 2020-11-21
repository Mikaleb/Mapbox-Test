<template>
  <div class="zds">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <z-card>
          <map-container />
        </z-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import MapContainer from '~/components/MapContainer.vue'
import { ZCard } from '@zoov/design-system/src/components/ZCard'

export default {
  name:'Index',
  components: {
    VuetifyLogo,
    MapContainer,
    ZCard
  }
}
</script>
