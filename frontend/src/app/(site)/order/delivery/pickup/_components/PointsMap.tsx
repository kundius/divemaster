'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { usePointsQuery } from './PointsQuery'
import { useLocationStore } from '@/providers/location-store-provider'
import { PickupPointEntity } from '@/types'

export function PointsMap() {
  const locationStore = useLocationStore((state) => state)
  const { loading, rows, mapRef, setSelected } = usePointsQuery()
  const mapElRef = useRef<HTMLDivElement>(null)
  const points = useRef(new Map())
  const [mapInitialized, setMapInitialized] = useState(false)

  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return

    mapRef.current.geoObjects.removeAll()
    points.current.clear()

    const geoObjects: any = []

    for (const row of rows) {
      if (!row.lat || !row.lon) continue

      const point = new ymaps.GeoObject(
        {
          geometry: {
            type: 'Point',
            coordinates: [row.lat, row.lon]
          },
          properties: {
            iconCaption: row.shortAddress
          }
        },
        {
          preset: 'islands#circleIcon'
        }
      )

      point.events.add('click', () => setSelected(row))

      points.current.set(row.id, point)
      geoObjects.push(point)
    }

    if (geoObjects.length > 0) {
      const clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: false,
        clusterBalloonPanelMaxMapArea: 0
      })
      clusterer.add(geoObjects)
      mapRef.current.geoObjects.add(clusterer)

      // центрирование и зум по точкам, покажет весь регион в случает отстутствия ПВЗ в городе
      // mapRef.current.setBounds(mapRef.current.geoObjects.getBounds(), {
      //   checkZoomRange: true
      // })

      // центрирование и зум по городу, покажет город даже если там нет ПВЗ
      mapRef.current.setCenter([locationStore.city.lat, locationStore.city.lon], 13)
    }
  }, [rows, mapInitialized])

  const onReadyMapApi = () => {
    mapRef.current = new ymaps.Map(mapElRef.current, {
      center: [locationStore.city.lat, locationStore.city.lon],
      zoom: 10,
      controls: []
    })
    setMapInitialized(true)
  }

  const onReadyMapScript = () => {
    ymaps.ready(onReadyMapApi)
  }

  return (
    <>
      <Script
        src={`https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=${process.env.NEXT_PUBLIC_MAPS_TOKEN}`}
        onReady={onReadyMapScript}
      />
      <div ref={mapElRef} className="w-full h-full" />
    </>
  )
}
