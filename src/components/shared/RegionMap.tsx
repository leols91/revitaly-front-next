import { useState } from 'react'
import dynamic from 'next/dynamic'
import classNames from '@/utils/classNames'
import { PatternCircles } from '@visx/pattern'
import WorldMap from '@/assets/maps/world-countries-sans-antarctica.json'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import type { Dispatch, ReactNode, SetStateAction } from 'react'

type MarkerCallback = (MarkerComponent: typeof Marker) => ReactNode

type MapDataProp = {
  name: string
  value?: string | number
  color?: string
}[]

type RegionMapProps = {
  data: MapDataProp
  mapSource?: string | Record<string, any> | string[]
  valueSuffix?: string
  valuePrefix?: string
  marker?: MarkerCallback
  hoverable?: boolean
}

// componentes carregados dinamicamente (ssr: false)
const ComposableMap = dynamic(
  () => import('react-simple-maps').then((mod) => mod.ComposableMap),
  { ssr: false, loading: () => null },
)
const Geographies = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Geographies),
  { ssr: false, loading: () => null },
)
const Geography = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Geography),
  { ssr: false, loading: () => null },
)
const Marker = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Marker),
  { ssr: false, loading: () => null },
)

const geoUrl = WorldMap

function getRegionValue(
  name: unknown,
  data: MapDataProp,
  suffix = '',
  prefix = '',
) {
  if (data.length > 0 && name) {
    for (const elm of data) {
      if (name === elm.name) {
        return `${elm.name} - ${prefix}${elm.value}${suffix}`
      }
    }
    return ''
  }
  return ''
}

//
// **Aqui está a correção: props de MapChart agora incluem suffix e prefix**
//
type MapChartProps = {
  setTooltipContent: Dispatch<SetStateAction<string>>
} & Pick<RegionMapProps, 'data' | 'mapSource' | 'marker' | 'hoverable'> & {
  suffix?: string
  prefix?: string
}

const MapChart = ({
  setTooltipContent,
  data,
  mapSource,
  prefix,
  suffix,
  marker,
  hoverable = true,
}: MapChartProps) => (
  <ComposableMap
    style={{ transform: 'translateY(20px)' }}
    data-tip=""
    height={450}
    projectionConfig={{ scale: 170 }}
  >
    <PatternCircles
      id="map-dots"
      height={6}
      width={6}
      className="fill-gray-300 dark:fill-gray-500"
      strokeWidth={1}
      background="transparent"
    />
    <PatternCircles
      id="map-dots-hover"
      height={6}
      width={6}
      className="fill-gray-400 dark:fill-gray-300"
      strokeWidth={1}
      background="transparent"
    />

    <Geographies geography={mapSource}>
      {({ geographies }: { geographies: any[] }) =>
        geographies.map((geo) => {
          const geoName = geo.properties.name
          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              strokeWidth={2}
              className={classNames('stroke-transparent')}
              fill="url('#map-dots')"
              style={
                hoverable
                  ? {
                      hover: {
                        fill: "url('#map-dots-hover')",
                      },
                    }
                  : {}
              }
              onMouseEnter={() => {
                setTooltipContent(
                  getRegionValue(
                    geoName,
                    data,
                    suffix ?? '',
                    prefix ?? '',
                  ),
                )
              }}
              onMouseLeave={() => {
                setTooltipContent('')
              }}
            />
          )
        })
      }
    </Geographies>

    {marker?.(Marker)}
  </ComposableMap>
)

const Map = (props: Omit<RegionMapProps, 'valueSuffix' | 'valuePrefix'> & {
  prefix?: string
  suffix?: string
}) => {
  const [content, setContent] = useState('')
  return (
    <>
      <MapChart {...props} setTooltipContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
    </>
  )
}

const RegionMap = ({
  data = [],
  mapSource = geoUrl,
  valueSuffix,
  valuePrefix,
  marker,
  hoverable,
}: RegionMapProps) => (
  <Map
    data={data}
    mapSource={mapSource}
    prefix={valuePrefix}
    suffix={valueSuffix}
    marker={marker}
    hoverable={hoverable}
  />
)

export default RegionMap