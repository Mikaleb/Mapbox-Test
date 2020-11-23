<template>
  <div v-if="bikes">
    <v-data-table
      :headers="headers"
      :items="bikesArray"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Bike List</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px" @click:outside="close()">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Add a bike
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <z-input
                        v-model="editedItem.serial_number"
                        label="Serial Number"
                      ></z-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-checkbox
                        v-model="editedItem.in_order"
                        :label="`In Order: ${editedItem.in_order.toString()}`"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model.number="editedItem.service_status"
                        :items="serviceStatusTxt"
                        :item-text="serviceStatusTxt"
                        :item-value="editedItem.service_status"
                        label="Service Status"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <z-input
                        v-model.number="editedItem.battery_level"
                        label="battery_level"
                      ></z-input>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <template
                        v-for="(coordonate, index) in editedItem.location
                          .coordinates"
                      >
                        <z-input
                          v-model.number="
                            editedItem.location.coordinates[index]
                          "
                          :key="index"
                          :value="coordonate"
                          :label="index === 0 ? 'Lat' : 'Long'"
                        ></z-input> </template
                    ></v-col>
                    <v-col cols="6" sm="6" md="4"> </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close()">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dialogDelete"
            max-width="500px"
            @click:outside="close()"
          >
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close()"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm()"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize()">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  computed,
  ref,
  watch,
} from '@nuxtjs/composition-api'
//@ts-ignore
import { ZInput } from '@zoov/design-system/src/components/ZInput'
import useApi from '~/composables/use-api'
import { Bike } from '~/types/bike'

export default defineComponent({
  name: 'BikesList',
  components: {
    ZInput,
  },
  setup(props, ctx) {
    const {
      bikes,
      bikesGeoPoints,
      fetchBikes,
      updateBike,
      addBike,
      deleteBike,
      serviceStatusTxt,
    } = useApi({ ctx })
    let bikesArray: any = ref([])
    let bike: any = ref(null)

    let dialog = ref(false)
    let dialogDelete = ref(false)
    let editedIndex = ref(-1)
    const headers = [
      {
        text: 'Serial Number',
        align: 'start',
        sortable: false,
        value: 'serial_number',
      },
      { text: 'Location', value: 'location' },
      { text: 'In order', value: 'in_order' },
      { text: 'Service status', value: 'service_status' },
      { text: 'Battery (%)', value: 'battery_level' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]

    const defaultItem = {
      serial_number: '',
      location: { type: 'Point', coordinates: [2.24356, 48.7723] },
      in_order: true,
      service_status: 1,
      battery_level: 100,
    }

    let editedItem = ref(defaultItem)

    const formTitle = computed(() =>
      editedIndex.value === -1 ? 'New Item' : 'Edit Item'
    )

    watch(
      () => dialog,
      (val, prevLocale) => {
        val || close()
      }
    )
    watch(
      () => dialogDelete,
      (val, prevLocale) => {
        val || close()
      }
    )

    const setEditedItem = (item: any) => {
      if (Array.isArray(bikes.value)) {
        editedIndex.value = bikes.value.indexOf(item)
        editedItem.value = Object.assign({}, item)
      }
    }

    const setBike = (val: any) => {
      bike.value = bikesArray.value.find(
        (bike: any) => bike.serial_number === val.serial_number
      )
    }

    const editItem = (item: any) => {
      setEditedItem(item)
      setBike(item)
      dialog.value = true
    }

    const deleteItem = (item: any) => {
      setEditedItem(item)
      setBike(item)
      dialogDelete.value = true
    }

    const deleteItemConfirm = () => {
      if (Array.isArray(bikes.value)) {
        deleteBike(bike.value, editedItem.value)
        bikes.value.splice(editedIndex.value, 1)
        close()
      }
    }

    const close = () => {
      dialog.value = false
      ctx.root.$nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem)
        editedIndex.value = -1
      })
    }

    const save = () => {
      if (Array.isArray(bikes.value)) {
        if (editedIndex.value > -1) {
          // Edit
          Object.assign(bikes.value[editedIndex.value], editedItem)
          updateBike(bike.value, editedItem.value)
        } else {
          // Add
          bikes.value.push(editedItem)
          addBike(bike.value, editedItem.value)
        }
        close()
      }
    }

    onMounted(async () => {
      await fetchBikes()
      bikesArray.value = bikes.value
    })

    return {
      bikes,
      bike,
      editedItem,
      headers,
      dialog,
      dialogDelete,
      editedIndex,
      defaultItem,
      formTitle,
      editItem,
      deleteItem,
      deleteItemConfirm,
      close,
      bikesArray,
      save,
      serviceStatusTxt,
    }
  },
})
</script>

