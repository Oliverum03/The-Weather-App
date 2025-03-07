'use client'
import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import NavBar from "@/components/NavBar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convert } from "@/utils/convertKelvToCel";
import { getDayorNightIcons } from "@/utils/getDayorNightIcons";
import { meterToKilometers } from "@/utils/meterToKilometer";
import { meterXsecToKmXhour } from "@/utils/meterXsecToKmXhour";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
};

export default function Home() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [place, setPlace] = useAtom(placeAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async() => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`);
      return data;
    }
  })

  useEffect(() => {refetch();}, [place, refetch]);

  if (isPending) return <div className="flex items-center min-h-screen justify-center">
    <LoadingWeather />
  </div>;

  if (error) return 'An error has occurred: ' + error.message;

  const firstDay = data.list.slice(0,8); // to separate the actual first day from the entire array

  const uniqueDates = [
    ...new Set(
      data.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  //Filtering data to get the first entry after 6 AM for each unique date
  const firstDataforEachDate = uniqueDates.map((date) => {
    return data.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  })
  firstDataforEachDate.shift(); // remove the first day from the array

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <NavBar location={`${data.city.name}, ${data.city.country}`}/>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity ? (<LoadingWeather />) : (
        <>
          {/* Today */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="flex gap-1 text-2xl items-end">
                <p>{ format(parseISO(firstDay[0].dt_txt ?? ' '), 'EEEE') }</p>
                <p className="text-lg">({ format(parseISO(firstDay[0].dt_txt ?? ' '), 'dd.MM.yyyy') })</p>
              </h2>
              <Container className="gap-10 px-6 items-center">
                {/* Temperature */}
                <div className="flex flex-col px-4">
                  <span className="text-5xl">
                    {convert(firstDay[0].main.temp ?? 0)}°
                  </span>
                  <p className="text-xs space-x-1 whitespace-nowrap">
                    feels like {convert(firstDay[0].main.feels_like ?? 0)}°
                    </p>
                  <p className="text-xs space-x-2">
                    <span>
                      {convert(firstDay[0].main.temp_min ?? 0)}°↓{" "}
                    </span>
                    <span>
                    {" "}{convert(firstDay[0].main.temp_max ?? 0)}°↑
                    </span> 
                  </p>
                </div>
                {/* Time and weather icon */}
                <div className="flex gap-7 sm:gap-14 overflow-x-auto w-full justify-between pr-3">
                  {firstDay.map((d,i) => (
                    <div key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                      <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), 'h:mm a')}</p>
                      <WeatherIcon iconname={getDayorNightIcons(d.weather[0].icon, d.dt_txt)} />
                      <p>{convert(d.main.temp ?? 0)}°</p>
                    </div>
                  ))}
                </div>
              </Container>
            </div>
            <div className="flex gap-4">
              {/* left container */}
              <Container className="w-fit justify-center flex-col px-4 items-center">
                <p className="capitalize text-center">{firstDay[0].weather[0].description}</p>
                <WeatherIcon iconname={firstDay[0].weather[0].icon}/>
              </Container>
              {/* right container */}
              <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails 
                    visibility={meterToKilometers(firstDay[0].visibility)}
                    humidity={`${firstDay[0].main.humidity.toString()} %`}
                    windSpeed={meterXsecToKmXhour(firstDay[0].wind.speed)}
                    airPressure={`${firstDay[0].main.pressure} hPa`}
                    sunrise={`${format(fromUnixTime(data.city.sunrise), 'h:mm')} AM`}
                    sunset={`${format(fromUnixTime(data.city.sunset), 'h:mm')} PM`}
                  />
              </Container>
            </div>
          </section>
          {/* 7-days forecast */}
          <section className="flex w-full flex-col gap-4">
            <p className="text-2xl">5-days Forecast:</p>
            {firstDataforEachDate.map((d, i) => (
              <ForecastWeatherDetail
                key={i} 
                weatherIcon={d?.weather[0].icon ?? "02d"}
                date={ format(parseISO(d?.dt_txt ?? ' '), 'dd.MM') }
                day={ format(parseISO(d?.dt_txt ?? ' '), 'EEEE') }
                temp={d?.main.temp ?? 30}
                tempMax={d?.main.temp_max ?? 32}
                tempMin={d?.main.temp_min ?? 28}
                feelsLike={d?.main.feels_like ?? 31}
                description={d?.weather[0].description ?? "clear sky"}
                sunrise={`${format(fromUnixTime(data.city.sunrise), 'h:mm')} AM`}
                sunset={`${format(fromUnixTime(data.city.sunset), 'h:mm')} PM`}
                visibility={meterToKilometers(d?.visibility ?? 25)}
                humidity={`${d?.main.humidity.toString()} %`}
                airPressure={`${d?.main.pressure} hPa`}
                windSpeed={meterXsecToKmXhour(d?.wind.speed ?? 25)}
              />
            ))}
          </section>
        </>
        )}
      </main>
    </div>
  );
}

function LoadingWeather() {
  return (
    <div className="animate-pulse">
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p className="bg-gray-300 h-8 w-32 rounded-md"></p>
              <p className="bg-gray-300 h-6 w-40 rounded-md"></p>
            </h2>
            <div className="gap-10 px-6 items-center">
              {/* Temperature */}
              <div className="flex flex-col px-4">
                <span className="bg-gray-300 h-16 w-20 rounded-md"></span>
                <p className="bg-gray-300 h-4 w-32 rounded-md"></p>
                <p className="bg-gray-300 h-4 w-24 rounded-md"></p>
              </div>
              {/* Time and weather icon */}
              <div className="flex gap-7 sm:gap-14 overflow-x-auto w-full justify-between pr-3">
                {Array(6).fill("").map((_, i) => (
                  <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                    <p className="bg-gray-300 h-4 w-16 rounded-md"></p>
                    <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
                    <p className="bg-gray-300 h-4 w-10 rounded-md"></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {/* left container */}
            <div className="w-fit justify-center flex-col px-4 items-center">
              <p className="bg-gray-300 h-6 w-28 rounded-md"></p>
              <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
            </div>
            {/* right container */}
            <div className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              {Array(4).fill("").map((_, i) => (
                <div key={i} className="bg-gray-300 h-6 w-24 mb-2 rounded-md"></div>
              ))}
            </div>
          </div>
        </section>
        {/* 7-days forecast */}
        <section className="flex w-full flex-col gap-4">
          <p className="bg-gray-300 h-6 w-40 rounded-md"></p>
          {Array(7).fill("").map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
              <div className="bg-gray-300 h-6 w-28 rounded-md"></div>
              <div className="bg-gray-300 h-6 w-36 rounded-md"></div>
              <div className="bg-gray-300 h-6 w-24 rounded-md"></div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}