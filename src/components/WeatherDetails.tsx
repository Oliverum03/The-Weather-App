import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';

export interface WeatherDetailsProps {
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: WeatherDetailsProps) {
  const { 
    visibility = "10km", 
    humidity = "50%", 
    windSpeed = "10km/h", 
    airPressure = "1000hPa", 
    sunrise = "06:00", 
    sunset = "18:00"} = props;

  return (
    <>
    <SingleWeatherDetail icon={<LuEye />} information='Visibility' value={visibility}/>
    <SingleWeatherDetail icon={<FiDroplet />} information='Humidity' value={humidity}/>
    <SingleWeatherDetail icon={<MdAir />} information='Wind Speed' value={windSpeed}/>
    <SingleWeatherDetail icon={<ImMeter />} information='Air Pressure' value={airPressure}/>
    <SingleWeatherDetail icon={<LuSunrise />} information='Sunrise' value={sunrise}/>
    <SingleWeatherDetail icon={<LuSunset />} information='Sunset' value={sunset}/>
    </>
  )
}

export interface SingleWeatherDetailProps {
    information: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetail (props: SingleWeatherDetailProps) {
    return (
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'>{props.information}</p>
            <div className='text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        </div>
    );
}