import React from 'react'
import Container from './Container'
import WeatherIcon from './WeatherIcon'
import WeatherDetails, { WeatherDetailsProps } from './WeatherDetails';
import { convert } from '@/utils/convertKelvToCel';

export interface ForecastWeatherDetailProps extends WeatherDetailsProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  description: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
  const {
    weatherIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp = 30,
    feelsLike = 32,
    tempMin = 28,
    tempMax = 31,
    description = "clear sky",
  } = props;

  return (
    <Container className='gap-4'>
      {/* temperature forecast */}
      <section className='flex gap-4 items-center px-4'>
        {/* Icon and Date */}
        <div className='flex flex-col gap-1 items-center'>
          <WeatherIcon iconname={weatherIcon}/>
          <p>{date}</p>
          <p className='text-sm'>{day}</p> 
        </div>
        {/* Temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convert(temp)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  feels like {convert(feelsLike)}°
                  </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convert(tempMin)}°↓{" "}
                  </span>
                  <span>
                  {" "}{convert(tempMax)}°↑
                  </span> 
                </p>
                <p className='capitalize text-center'>{description}</p>
              </div>
      </section>
      {/* weather details */}
      <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
        <WeatherDetails 
          visibility={props.visibility}
          humidity={props.humidity}
          windSpeed={props.windSpeed}
          airPressure={props.airPressure}
          sunrise={props.sunrise}
          sunset={props.sunset}
        />
      </section>
    </Container>
  )
}