'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'
import { CityEntity } from '@/types'

import css from './CitySelectForm.module.css'
import { cn } from '@/lib/utils'

export interface CitySelectFormProps {
  onChangeLocation(city: CityEntity): void
  initialCity: CityEntity
}

function sortCityByName(a: CityEntity, b: CityEntity) {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }
  return 0
}

export function CitySelectForm({ onChangeLocation, initialCity }: CitySelectFormProps) {
  const [step, setStep] = useState<'district' | 'subject' | 'city'>('district')
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
      .sort()
  }, [query])

  const regions = useMemo(() => {
    if (!query.data) return []
    return query.data
      .filter((city) => city.district === district)
      .map((city) => city.subject)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort()
  }, [district, query])

  const cities = useMemo(() => {
    if (!query.data) return []
    return query.data.filter((city) => city.subject === subject).sort(sortCityByName)
  }, [subject, query])

  const searchCities = useMemo(() => {
    if (!query.data) return []
    return query.data
      .filter((item) => item.name.toLowerCase().startsWith(search.toLowerCase()))
      .sort(sortCityByName)
  }, [search, query])

  const changeDistrict = (name: string) => {
    setCity(undefined)
    setSubject(undefined)
    setDistrict(name)
    setStep('subject')
  }

  const changeSubject = (name: string) => {
    setCity(undefined)
    setSubject(name)
    setDistrict(query.data?.find((city) => city.subject === name)?.district)
    setStep('city')
  }

  const changeCity = (city: CityEntity) => {
    setCity(city)
    setSubject(city.subject)
    setDistrict(city.district)
    onChangeLocation(city)
    setStep('district')
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
            <div className="flex flex-col gap-2 items-start h-96 overflow-auto max-md:h-auto">
              {searchCities.map((item) => (
                <Button
                  variant={city?.name === item.name ? 'default' : 'ghost'}
                  key={item.id}
                  onClick={() => changeSearchCity(item)}
                  className="whitespace-normal text-left"
                >
                  {item.name} ({item.subject})
                </Button>
              ))}
            </div>
          ) : (
            <div className="px-4 font-medium text-lg">Город не найден</div>
          )}
        </div>
      ) : (
        <div className="flex gap-2 mt-6 max-md:flex-col">
          <div className="w-1/3 max-md:w-full">
            <div className="px-4 font-medium text-lg">Округ</div>
            <div
              className={cn(
                'flex flex-col gap-2 items-start h-96 overflow-auto mt-4 max-md:h-auto',
                {
                  'max-md:hidden': step !== 'district'
                }
              )}
            >
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
          <div className="w-px bg-neutral-100 max-md:w-full max-md:h-px" />
          <div className="w-1/3 max-md:w-full">
            <div className="px-4 font-medium text-lg">Регион</div>
            <div
              className={cn(
                'flex flex-col gap-2 items-start h-96 overflow-auto mt-4 max-md:h-auto',
                {
                  'max-md:hidden': step !== 'subject'
                }
              )}
            >
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
          <div className="w-px bg-neutral-100 max-md:w-full max-md:h-px" />
          <div className="w-1/3 max-md:w-full">
            <div className="px-4 font-medium text-lg">Город</div>
            <div
              className={cn(
                'flex flex-col gap-2 items-start h-96 overflow-auto mt-4 max-md:h-auto',
                {
                  'max-md:hidden': step !== 'city'
                }
              )}
            >
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
