'use client'
import React, { useState } from 'react'
import { MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '@/app/atom';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

type Props = {location: string};

export default function NavBar(props: Props) {

  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState<string[]>([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [place, setPlace] = useAtom(placeAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInput(value: string) {
    setCity(value);
    if(value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const suggestion = response.data.list.map((item: any) => item.name);
        setSuggestion(suggestion);
        setError("");
        setShowSuggestion(true);
      } catch (error) {
        console.log(error);
        setSuggestion([]);
        setShowSuggestion(false);
      }
    }
    else {
      setSuggestion([]);
      setShowSuggestion(false);
    }
 }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingCity(true);
    if(suggestion.length == 0){
      setError("Location not found");
      setLoadingCity(false);
    }
    else {
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestion(false);
      }, 500);
    }
 }

 function handleSuggestionClick(value: string) {
  setCity(value);
  setShowSuggestion(false);
 }

//  DOESN'T WORK
  function handleCurrentLocation() {
    console.log("Getting current location");
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          console.log(response.data.name);
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {  
          console.log(error);
          console.log("error catched");
          setLoadingCity(false);     
        }
      });
    }
    else {
      console.log("Geolocation is not supported by this browser");
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top-o left-0 z-50 bg-white">
        <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'> 
          <h2 className='flex items-center justify-center gap-2'>
            <p className='text-gray-500 text-3xl'>Weather</p>
            <MdWbSunny className='text-3xl mt-1 text-yellow-300'/>
          </h2>
          <section className='flex gap-2 items-center'>
            <MdMyLocation 
            title='Get Your Current Location'
            onClick={handleCurrentLocation}
            className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'/>
            <MdOutlineLocationOn className='text-3xl'/>
            <p className='text-slate-900/80 text-sm'>{props.location}</p>
            <div className='relative hidden md:flex'>
              <SearchBox 
              value={city} 
              onChange={(e) => handleInput(e.target.value)} 
              onSubmit={(e) =>  handleSubmit(e)} 
              />
              <SuggestionBox 
              handleSuggestionClick={handleSuggestionClick} 
              suggestion={suggestion} 
              error={error}
              showSuggestion={showSuggestion}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className='flex maxw-7xl px-3 md:hidden'>
        <div className='relative'>
          <SearchBox 
            value={city} 
            onChange={(e) => handleInput(e.target.value)} 
            onSubmit={(e) =>  handleSubmit(e)} 
          />
          <SuggestionBox 
            handleSuggestionClick={handleSuggestionClick} 
            suggestion={suggestion} 
            error={error}
            showSuggestion={showSuggestion}
          />
        </div>
      </section>
    </>
  )
}

function SuggestionBox({
  showSuggestion,
  suggestion,
  handleSuggestionClick,
  error
}: {
  showSuggestion: boolean;
  suggestion: string[];
  handleSuggestionClick: (item: string) => void; 
  error: string
}) {
  return (
    <> 
      {((showSuggestion && suggestion.length > 1) || error) && (
        <ul className='mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]
        flex flex-col gap-1 py-2 px-2'>
          {error && suggestion.length < 1 && 
            (<li className='text-red-500 p-1'>{error}</li> 
          )}
          {suggestion.map((item, i) => (
            <li 
              key={i} 
              className='cursor-pointer p-1 rounded hover:bg-gray-200'
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </li>
          ))}
        </ul> 
      )}
    </>
  );
}