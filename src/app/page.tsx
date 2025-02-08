'use client'
import NavBar from "@/components/NavBar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
      // fetch('https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=b2b530d9bd15778e5e1c5e835a39820a&cnt=40')
      // .then((res) => res.json(),
      // ),
  })

  if (isPending) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;
  console.log('data', data.city.name)

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <NavBar/>
    </div>
  );
}
