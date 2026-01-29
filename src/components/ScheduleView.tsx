'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Schedule {
  id: string;
  scheduledAt: string;
  doseType: string;
  taken: boolean;
  takenAt?: string;
  skipped: boolean;
  rescheduled: boolean;
  medication: {
    id: string;
    name: string;
    dosage: string;
    categories: Array<{
      category: {
        id: string;
        name: string;
      };
    }>;
  };
}

export default function ScheduleView({
  userId,
  filter = 'upcoming',
}: {
  userId: string;
  filter?: 'upcoming' | 'today' | 'missed';
}) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
    
    // Listen for medication added event to refresh schedules
    const handleMedicationAdded = () => {
      fetchSchedules();
    };
    
    window.addEventListener('medicationAdded', handleMedicationAdded);
    
    return () => {
      window.removeEventListener('medicationAdded', handleMedicationAdded);
    };
  }, [userId, filter]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`/api/schedules?filter=${filter}`, {
        headers: {
          'x-user-id': userId,
        },
      });
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, action: string) => {
    try {
      await fetch(`/api/schedules/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ action }),
      });
      fetchSchedules();
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
  };

  const rescheduleDose = async (id: string) => {
    const newTime = prompt('Enter new date and time (YYYY-MM-DD HH:MM):');
    if (!newTime) return;

    // Validate date format
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateTimeRegex.test(newTime)) {
      alert('Invalid format. Please use YYYY-MM-DD HH:MM (e.g., 2024-01-30 14:30)');
      return;
    }

    // Validate that it's a valid date
    const parsedDate = new Date(newTime.replace(' ', 'T'));
    if (isNaN(parsedDate.getTime())) {
      alert('Invalid date. Please enter a valid date and time.');
      return;
    }

    try {
      await fetch(`/api/schedules/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ action: 'reschedule', scheduledAt: newTime }),
      });
      fetchSchedules();
    } catch (error) {
      console.error('Failed to reschedule:', error);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-center py-8">Loading schedule...</div>;
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">
          {filter === 'upcoming' && 'No upcoming doses'}
          {filter === 'today' && 'No doses scheduled for today'}
          {filter === 'missed' && 'No missed doses'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className={`bg-gray-700 rounded-lg p-5 border transition ${
            schedule.taken
              ? 'border-green-600 bg-opacity-50'
              : schedule.skipped
              ? 'border-yellow-600 bg-opacity-50'
              : 'border-gray-600 hover:border-blue-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-lg font-semibold text-white">
                  {schedule.medication.name}
                </h4>
                <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                  {schedule.doseType}
                </span>
                {schedule.taken && (
                  <span className="bg-green-900 text-green-200 px-2 py-1 rounded text-xs">
                    Taken
                  </span>
                )}
                {schedule.skipped && (
                  <span className="bg-yellow-900 text-yellow-200 px-2 py-1 rounded text-xs">
                    Skipped
                  </span>
                )}
              </div>

              <div className="text-gray-400 text-sm mb-2">
                Dosage: {schedule.medication.dosage}
              </div>

              <div className="text-gray-300 text-sm">
                {format(new Date(schedule.scheduledAt), 'PPpp')}
              </div>

              {schedule.medication.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {schedule.medication.categories.map((cat) => (
                    <span
                      key={cat.category.id}
                      className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-xs"
                    >
                      {cat.category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {!schedule.taken && !schedule.skipped && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => updateSchedule(schedule.id, 'take')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Take
                </button>
                <button
                  onClick={() => updateSchedule(schedule.id, 'skip')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Skip
                </button>
                <button
                  onClick={() => rescheduleDose(schedule.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Reschedule
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
