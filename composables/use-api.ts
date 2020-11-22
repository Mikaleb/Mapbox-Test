import { reactive, toRefs, SetupContext } from "@nuxtjs/composition-api"
import axios from "axios"
import { Bike } from "../types/bike"

interface Options {
  ctx: SetupContext;
}

type globalState = {
  bikes: object | null;
  bikesGeoPoints: object | null;
}

export default function useApi({ ctx }: Options) {
  const apiState: any = reactive({
    response: [],
    error: null,
    fetching: false
  })

  const globalState: globalState = reactive({
    bikes: {},
    bikesGeoPoints: {}
  })

  const fetchBikes = async () => {
    apiState.fetching = true

    const { data } = await axios.get(
      `https://jsonbox.io/${process.env.NUXT_ENV_BOX_ID}`
    )
    globalState.bikes = data

    const service_status_txt = ['free', 'booked', 'in use']

    const dataPoints = data.map((bike: Bike) => {
      let dataPoint = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 0] // long,lat : sadly not an object
        },
        properties: {
          title: "",
          description: ""
        }
      }

      dataPoint.geometry.coordinates = bike.location.coordinates
      dataPoint.properties.title = bike.serial_number
      dataPoint.properties.description = `Status : ${service_status_txt[bike.service_status - 1]}  - ${bike.battery_level} % `

      return dataPoint
    })

    globalState.bikesGeoPoints = dataPoints
  }

  return {
    ...toRefs(apiState),
    ...toRefs(globalState),
    fetchBikes
  }
}
