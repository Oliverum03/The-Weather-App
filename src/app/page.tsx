'use client'
import Container from "@/components/Container";
import NavBar from "@/components/NavBar";
import WeatherIcon from "@/components/WeatherIcon";
import { convert } from "@/utils/convertKelvToCel";
import { getDayorNightIcons } from "@/utils/getDayorNightIcons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";

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
  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async() => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=40`);
      return data;
    }
  })

  if (isPending) return <div className="flex items-center min-h-screen justify-center">
    <p className="animate-bounce">Loading...</p>
  </div>;

  if (error) return 'An error has occurred: ' + error.message;

  const firstDay = data.list.slice(0,8); // to separate the actual first day from the entire array

  console.log('data', data)

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <NavBar/>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
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
                    <WeatherIcon iconName={getDayorNightIcons(d.weather[0].icon, d.dt_txt)} />
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
              <WeatherIcon iconName={firstDay[0].weather[0].icon}/>
            </Container>
            {/* right container */}
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
            
            </Container>
          </div>
        </section>
        {/* 7-days forecast */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">7-days Forecast:</p>
        </section>
      </main>
    </div>
  );
}
