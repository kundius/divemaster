'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { usePointsQuery } from './PointsQuery'

export function PointsMap() {
  const { loading, rows } = usePointsQuery()
  const mapRef = useRef<any>()
  const mapElRef = useRef<HTMLDivElement>(null)
  const points = useRef(new Map())
  const [mapInitialized, setMapInitialized] = useState(false)

  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return

    mapRef.current.geoObjects.removeAll()
    points.current.clear()

    const customBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      [
        '<ul style="padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">',
        '{% for geoObject in properties.geoObjects %}',
        '<li><a style="color: #000;" href="#" data-id="{{ geoObject.properties.id }}">{{ geoObject.properties.iconCaption|raw }}</a></li>',
        '{% endfor %}',
        '</ul>'
      ].join('')
    )

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
            iconCaption: row.address,
            id: row.id
          }
        },
        {
          preset: 'islands#circleIcon'
        }
      )

      // point.events.add('click', () => handleClickMap(row.id))

      points.current.set(row.id, point)
      geoObjects.push(point)
    }

    if (geoObjects.length > 0) {
      const clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: false,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayout: customBalloonContentLayout
      })
      clusterer.add(geoObjects)
      mapRef.current.geoObjects.add(clusterer)
      mapRef.current.setBounds(mapRef.current.geoObjects.getBounds())
    }
  }, [rows, mapInitialized])

  const onReadyMapApi = () => {
    mapRef.current = new ymaps.Map(mapElRef.current, {
      center: [55.76, 37.64],
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
