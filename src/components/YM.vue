<template>
  <div id="mapYM"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { Store } from '@/stores/dbPinia'
let store = Store()
const init = () => {
  let myPlacemark: any,
    myMap = new (window as any).ymaps.Map(
      'mapYM',
      {
        center: [55.753994, 37.622093],
        zoom: 9
      },
      {
        searchControlProvider: 'yandex#search'
      }
    )

  myMap.events.add('click', function (e: any) {
    let coords = e.get('coords')
    store.$state.ymCoords = coords
    if (myPlacemark) {
      myPlacemark.geometry.setCoordinates(coords)
    } else {
      myPlacemark = createPlacemark(coords)
      myMap.geoObjects.add(myPlacemark)
      myPlacemark.events.add('dragend', function () {
        getAddress(myPlacemark.geometry.getCoordinates())
      })
    }
    getAddress(coords)
  })

  function createPlacemark(coords: any) {
    return new (window as any).ymaps.Placemark(
      coords,
      {
        iconCaption: 'searching...'
      },
      {
        preset: 'islands#violetDotIconWithCaption',
        draggable: true
      }
    )
  }

  // Determining the address by coordinates (reverse geocoding).
  function getAddress(coords: any) {
    myPlacemark.properties.set('iconCaption', 'searching...')
    ;(window as any).ymaps.geocode(coords).then(function (res: any) {
      let firstGeoObject = res.geoObjects.get(0)

      myPlacemark.properties.set({
        // Forming a string with the object's data.
        iconCaption: [
          // The name of the municipality or the higher territorial-administrative formation.
          firstGeoObject.getLocalities().length
            ? firstGeoObject.getLocalities()
            : firstGeoObject.getAdministrativeAreas(),
          // Getting the path to the toponym; if the method returns null, then requesting the name of the building.
          firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
        ]
          .filter(Boolean)
          .join(', '),
        // Specifying a string with the address of the object as the balloon content.
        balloonContent: firstGeoObject.getAddressLine()
      })
    })
  }
}
onMounted(() => {
  if (store.$state.ymScript) {
    ;(window as any).ymaps.ready(init)
  }
})
</script>

<style scoped>
#mapYM {
  border-radius: 15px;
  margin-top: 10px;
  width: 420px;
  height: 300px;
}
</style>
