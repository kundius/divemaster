'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'
import { CityEntity } from '@/types'

import css from './CitySelectForm.module.scss'

export interface CitySelectFormProps {
  onChangeLocation(city: CityEntity): void
  initialCity: CityEntity
}

export function CitySelectForm({ onChangeLocation, initialCity }: CitySelectFormProps) {
  const [district, setDistrict] = useState<string | undefined>(initialCity.district)
  const [subject, setSubject] = useState<string | undefined>(initialCity.subject)
  const [city, setCity] = useState<CityEntity | undefined>(initialCity)
  const [search, setSearch] = useState<string>('')

  const query = useSWR<CityEntity[]>(['city', {}])

  const districts = useMemo(() => {
    if (!query.data) return []
    return query.data
      .map((city) => city.district)
      .filter((value, index, array) => array.indexOf(value) === index)
  }, [query])

  const regions = useMemo(() => {
    if (!query.data) return []
    return query.data
      .filter((city) => city.district === district)
      .map((city) => city.subject)
      .filter((value, index, array) => array.indexOf(value) === index)
  }, [district, query])

  const cities = useMemo(() => {
    if (!query.data) return []
    return query.data.filter((city) => city.subject === subject)
  }, [subject, query])

  const searchCities = useMemo(() => {
    if (!query.data) return []
    return query.data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())) || []
  }, [search, query])

  const changeDistrict = (name: string) => {
    setCity(undefined)
    setSubject(undefined)
    setDistrict(name)
  }

  const changeSubject = (name: string) => {
    setCity(undefined)
    setSubject(name)
    setDistrict(query.data?.find((city) => city.subject === name)?.district)
  }

  const changeCity = (city: CityEntity) => {
    setCity(city)
    setSubject(city.subject)
    setDistrict(city.district)
    onChangeLocation(city)
  }

  const changeSearchCity = (city: CityEntity) => {
    setCity(city)
    setSubject(city.subject)
    setDistrict(city.district)
    onChangeLocation(city)
    setSearch('')
  }

  if (query.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <input
        className={css.search}
        placeholder="Найти город"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      {search ? (
        <div className="mt-6">
          {searchCities.length > 0 ? (
            <div className="flex flex-col gap-2 items-start h-96 overflow-auto">
              {searchCities.map((item) => (
                <Button
                  variant={city?.name === item.name ? 'default' : 'ghost'}
                  key={item.id}
                  onClick={() => changeSearchCity(item)}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="px-4 font-medium text-lg">Город не найден</div>
          )}
        </div>
      ) : (
        <div className="flex gap-2 mt-6">
          <div className="w-1/3">
            <div className="px-4 font-medium text-lg">Округ</div>
            <div className="flex flex-col gap-2 items-start h-96 overflow-auto mt-4">
              {districts.map((item) => (
                <Button
                  variant={district === item ? 'default' : 'ghost'}
                  key={item}
                  className="w-full justify-start"
                  onClick={() => changeDistrict(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="w-px bg-neutral-100" />
          <div className="w-1/3">
            <div className="px-4 font-medium text-lg">Регион</div>
            <div className="flex flex-col gap-2 items-start h-96 overflow-auto mt-4">
              {regions.map((item) => (
                <Button
                  variant={subject === item ? 'default' : 'ghost'}
                  key={item}
                  className="w-full justify-start"
                  onClick={() => changeSubject(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="w-px bg-neutral-100" />
          <div className="w-1/3">
            <div className="px-4 font-medium text-lg">Город</div>
            <div className="flex flex-col gap-2 items-start h-96 overflow-auto mt-4">
              {cities.map((item) => (
                <Button
                  variant={city?.name === item.name ? 'default' : 'ghost'}
                  key={item.id}
                  className="w-full justify-start"
                  onClick={() => changeCity(item)}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
