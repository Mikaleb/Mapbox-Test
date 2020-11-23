import { reactive, toRefs, SetupContext } from "@nuxtjs/composition-api"
import axios from "axios"
import { Bike } from "../types/bike"

interface Options {
  ctx: SetupContext;
}

type globalState = {
  bikes: object;
  bikesGeoPoints: object | null;
  serviceStatusTxt: any;
}

export default function useApi({ ctx }: Options) {
  const apiState: any = reactive({
    response: [],
    error: null,
    fetching: false
  })

  const globalState: globalState = reactive({
    bikes: {},
    bikesGeoPoints: {},
    serviceStatusTxt: ['free', 'booked', 'in use']
  })



  const fetchBikes = async () => {
    apiState.fetching = true

    const { data } = await axios.get(
      `https://jsonbox.io/${process.env.NUXT_ENV_BOX_ID}`
    )
    globalState.bikes = data
    apiState.fetching = false


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
      dataPoint.properties.description = `Status : ${globalState.serviceStatusTxt[bike.service_status - 1]}  - ${bike.battery_level} % `

      return dataPoint
    })

    globalState.bikesGeoPoints = dataPoints
  }

  const reloadPage = (data:any) => {
    if(data) window.location.reload(true)
  }

  const updateBike = async (oldData:any, newData: any) => {

    const serviceStatus = () => {
      if (newData.service_status === 0) {
        return 1
      }
      if(newData.service_status === oldData.service_status) return oldData.service_status
      return globalState.serviceStatusTxt.indexOf(newData.service_status) + 1
    }

    console.log(serviceStatus())

    const { data, status } = await axios.put(`https://jsonbox.io/${process.env.NUXT_ENV_BOX_ID}/${oldData._id}`, {
      ...newData,
      service_status: serviceStatus()
    })
    reloadPage(data)

    return data
  }


  const addBike = async (oldData:any, newData: any) => {

    const { data, status } = await axios.post(`https://jsonbox.io/${process.env.NUXT_ENV_BOX_ID}`, {
      ...newData,
      service_status: globalState.serviceStatusTxt.indexOf(newData.service_status) + 1
    })

    reloadPage(data)

    return data
  }

  const deleteBike = async (oldData:any, newData: any) => {

    const { data, status } = await axios.delete(`https://jsonbox.io/${process.env.NUXT_ENV_BOX_ID}/${oldData._id}`)
    reloadPage(data)


    return data
  }

  return {
    ...toRefs(apiState),
    ...toRefs(globalState),
    fetchBikes,
    addBike,
    updateBike,
    deleteBike
  }
}
