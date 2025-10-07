
import React from 'react';

const scheduleData = [
  { day: 'Lunes', time: '10:00 - 12:00', program: 'Mañana Musical' },
  { day: 'Lunes', time: '12:00 - 14:00', program: 'Noticias del Mediodía' },
  { day: 'Lunes', time: '14:00 - 17:00', program: 'Tarde de Éxitos' },
  { day: 'Martes', time: '10:00 - 12:00', program: 'Mañana Musical' },
  { day: 'Martes', time: '12:00 - 14:00', program: 'Noticias del Mediodía' },
  { day: 'Miércoles', time: '10:00 - 12:00', program: 'Clásicos del Rock' },
  { day: 'Jueves', time: '18:00 - 20:00', program: 'Noche de Jazz' },
  { day: 'Viernes', time: '20:00 - 23:00', program: 'Fiesta de Fin de Semana' },
];

const Schedule: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Nuestra Programación</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-surface rounded-lg shadow-lg">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Día</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Horario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Programa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {scheduleData.map((item, index) => (
              <tr key={index} className="hover:bg-background transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-text-main">{item.day}</td>
                <td className="px-6 py-4 whitespace-nowrap text-text-muted">{item.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-primary font-semibold">{item.program}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;