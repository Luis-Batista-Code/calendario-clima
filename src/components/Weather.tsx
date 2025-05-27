import React from 'react';

interface WeatherProps {
  data: any;
}

const Weather: React.FC<WeatherProps> = ({ data }) => {
  if (!data) return null;

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md py-2 px-4 flex items-center justify-center gap-2 text-sm text-zinc-700">
      <span className="text-lg">🌍</span>
      <span>
        {data.location.name}, {data.location.region} - {data.current.temp_c}°C, {data.current.condition.text}
      </span>
    </footer>
  );
};

export default Weather;
