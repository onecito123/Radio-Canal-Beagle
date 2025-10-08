import React from 'react';
import { ScheduleItem } from '../types';

interface ScheduleProps {
  scheduleData: ScheduleItem[];
}

const Schedule: React.FC<ScheduleProps> = ({ scheduleData }) => {
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
            {scheduleData.length > 0 ? scheduleData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-background transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-text-main">{item.day}</td>
                <td className="px-6 py-4 whitespace-nowrap text-text-muted">{item.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-primary font-semibold">{item.program}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="text-center py-8 text-text-muted">
                  La programación no está disponible en este momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;