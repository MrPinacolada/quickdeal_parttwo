<template>
  <div id="mapYM"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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

  function getAddress(coords: any) {
    myPlacemark.properties.set('iconCaption', coords)
    ;(window as any).ymaps.geocode(coords).then(function (res: any) {
      let firstGeoObject = res.geoObjects.get(0)

      myPlacemark.properties.set({
        iconCaption: [
          firstGeoObject.getLocalities().length
            ? firstGeoObject.getLocalities()
            : firstGeoObject.getAdministrativeAreas(),
          firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
        ]
          .filter(Boolean)
          .join(', '),
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
