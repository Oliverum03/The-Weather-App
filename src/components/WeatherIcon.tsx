import { cn } from '@/utils/cn'
import Image from 'next/image'
import React from 'react'

export default function WeatherIcon(props: React.HTMLProps<HTMLDivElement> & { iconname: string }) {
  return (
    <div {...props} className={cn('realtive h-20 w-20')}>
        <Image 
          width={100}
          height={100}
          alt='Weather Icon'
          src={`https://openweathermap.org/img/wn/${props.iconname}@4x.png`}
        />
    </div>
  )
}