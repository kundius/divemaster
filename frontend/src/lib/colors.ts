export type Color = {
  color: string
  name: string
}

export type Colors = Color[]

export type ColorsObject = Record<string, string>

export const colors: Colors = [
  {
    color: '#828742',
    name: 'камуфляж зеленый'
  },
  {
    color: '#a5895f',
    name: 'камуфляж'
  },
  {
    color: '#441000',
    name: 'коричневый'
  },
  {
    color: '#886d4e',
    name: 'камуфляж коричневый'
  },
  {
    color: 'white',
    name: 'белый'
  },
  {
    color: 'black',
    name: 'черный'
  },
  {
    color: 'red',
    name: 'красный'
  },
  {
    color: 'orange',
    name: 'оранжевый'
  },
  {
    color: 'yellow',
    name: 'желтый'
  },
  {
    color: 'green',
    name: 'зеленый'
  },
  {
    color: 'blue',
    name: 'синий'
  },
  {
    color: 'pink',
    name: 'розовый'
  },
  {
    color: '#C0C0C0',
    name: 'серебристый'
  }
]

export const colorsObject: ColorsObject = {
  'камуфляж зеленый': '#828742',
  камуфляж: '#a5895f',
  коричневый: '#441000',
  'камуфляж коричневый': '#886d4e',
  белый: 'white',
  черный: 'black',
  красный: 'red',
  оранжевый: 'orange',
  желтый: 'yellow',
  зеленый: 'green',
  синий: 'blue',
  розовый: 'pink',
  серебристый: '#C0C0C0'
}
