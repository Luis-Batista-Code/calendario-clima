import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Weather from './components/Weather';

interface MarkedDate {
  date: Date;
  detail: string;
}

const App: React.FC = () => {
  const [markedDates, setMarkedDates] = useState<MarkedDate[]>([]);
  const [weatherData, setWeatherData] = useState(null);

  // Para controlar o modal
  const [modalOpen, setModalOpen] = useState(false);
  const [dateToMark, setDateToMark] = useState<Date | null>(null);
  const [detailInput, setDetailInput] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=3c8f1299aaed4c0195d231935252705&q=${latitude},${longitude}&lang=pt`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Erro ao buscar clima:', error);
      }
    });
  }, []);

  // Abre o modal para marcar uma data
  const handleOpenModal = (date: Date) => {
    setDateToMark(date);
    setDetailInput('');
    setModalOpen(true);
  };

  // Salva a marcação e fecha modal
  const handleConfirmMark = () => {
    if (!dateToMark) return;
    if (detailInput.trim() === '') {
      alert('Por favor, insira um detalhe para a marcação.');
      return;
    }

    const exists = markedDates.some(
      (m) => m.date.toDateString() === dateToMark.toDateString() && m.detail === detailInput.trim()
    );

    if (!exists) {
      setMarkedDates(prev => [...prev, { date: dateToMark, detail: detailInput.trim() }]);
    }
    setModalOpen(false);
  };

  // Remove uma marcação específica
  const removeMark = (index: number) => {
    setMarkedDates(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 relative pb-20">
      <header className="w-full text-center py-6 shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-emerald-600">Calendário &amp; Clima</h1>
        <p className="text-sm text-zinc-500 mt-1">Veja o tempo e os dias com estilo</p>
      </header>

      <main className="flex flex-col justify-center items-center px-4 mt-10">
        <div className="max-w-3xl w-full">
          <Calendar onDateMark={handleOpenModal} />
        </div>

        <section className="mt-8 max-w-3xl w-full bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">Marcação dos Dias</h2>
          {markedDates.length === 0 ? (
            <p className="text-zinc-500 text-center">Nenhuma data marcada.</p>
          ) : (
            <ul>
              {markedDates.map(({ date, detail }, index) => (
                <li
                  key={date.toISOString() + detail}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div className="text-center w-full">
                    <strong>{date.toLocaleDateString()}</strong>: {detail}
                  </div>
                  <button
                    onClick={() => removeMark(index)}
                    className="text-red-500 hover:text-red-700 ml-4"
                    aria-label="Remover marcação"
                    title="Remover marcação"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Weather data={weatherData} />

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro do modal
          >
            <h3 className="text-xl font-semibold mb-4">
              Marcar data: {dateToMark?.toLocaleDateString()}
            </h3>
            <textarea
              value={detailInput}
              onChange={(e) => setDetailInput(e.target.value)}
              placeholder="Digite um detalhe para essa marcação"
              className="w-full p-2 border rounded mb-4 resize-none text-center"
              rows={4}
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmMark}
                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
