'use client';

import { useState, useEffect } from 'react';

interface Medication {
  id: string;
  name: string;
  description?: string;
  dosage: string;
  pattern: string;
  duration: number;
  startDate: string;
  endDate: string;
  categories: Array<{
    category: {
      id: string;
      name: string;
    };
  }>;
}

export default function MedicationList({ userId }: { userId: string }) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedications();
    
    // Listen for medication added event
    const handleMedicationAdded = () => {
      fetchMedications();
    };
    
    window.addEventListener('medicationAdded', handleMedicationAdded);
    
    return () => {
      window.removeEventListener('medicationAdded', handleMedicationAdded);
    };
  }, [userId]);

  const fetchMedications = async () => {
    try {
      const response = await fetch('/api/medications', {
        headers: {
          'x-user-id': userId,
        },
      });
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error('Failed to fetch medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication?')) return;

    try {
      await fetch(`/api/medications/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId,
        },
      });
      fetchMedications();
    } catch (error) {
      console.error('Failed to delete medication:', error);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-center py-8">Loading medications...</div>;
  }

  if (medications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No medications yet</div>
        <div className="text-gray-500 text-sm">Click "Add Medication" to get started</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map((med) => (
        <div
          key={med.id}
          className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-blue-500 transition"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{med.name}</h3>
              {med.description && (
                <p className="text-gray-400 text-sm mb-2">{med.description}</p>
              )}
            </div>
            <button
              onClick={() => deleteMedication(med.id)}
              className="text-red-400 hover:text-red-300 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-400 text-xs mb-1">Dosage</div>
              <div className="text-white font-medium">{med.dosage}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Pattern</div>
              <div className="text-white font-medium">{med.pattern}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Duration</div>
              <div className="text-white font-medium">{med.duration} days</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Start Date</div>
              <div className="text-white font-medium">
                {new Date(med.startDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {med.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {med.categories.map((cat) => (
                <span
                  key={cat.category.id}
                  className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-xs"
                >
                  {cat.category.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
