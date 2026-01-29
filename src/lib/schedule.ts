import { addDays, format, parseISO, isBefore, isAfter, startOfDay } from 'date-fns';

export interface DosePattern {
  pattern: string;
  times: string[];
}

export const DOSE_PATTERNS: Record<string, DosePattern> = {
  'once-daily': {
    pattern: 'once-daily',
    times: ['morning'],
  },
  '1+0+1': {
    pattern: '1+0+1',
    times: ['morning', 'evening'],
  },
  '1+1+1': {
    pattern: '1+1+1',
    times: ['morning', 'afternoon', 'evening'],
  },
  '1+1+1+1': {
    pattern: '1+1+1+1',
    times: ['morning', 'afternoon', 'evening', 'night'],
  },
};

export const TIME_SLOTS: Record<string, string> = {
  morning: '08:00',
  afternoon: '13:00',
  evening: '18:00',
  night: '22:00',
};

export interface ScheduleEntry {
  date: Date;
  doseType: string;
  time: string;
}

export function generateSchedule(
  startDate: Date,
  duration: number,
  pattern: string,
  customTiming?: Record<string, string>
): ScheduleEntry[] {
  const schedule: ScheduleEntry[] = [];
  const dosePattern = DOSE_PATTERNS[pattern];
  
  if (!dosePattern) {
    throw new Error(`Invalid pattern: ${pattern}`);
  }

  const timing = customTiming || TIME_SLOTS;

  for (let day = 0; day < duration; day++) {
    const currentDate = addDays(startDate, day);
    
    for (const doseType of dosePattern.times) {
      schedule.push({
        date: currentDate,
        doseType,
        time: timing[doseType] || TIME_SLOTS[doseType],
      });
    }
  }

  return schedule;
}

export function combineDateTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function filterUpcoming(schedules: any[], limit: number = 10): any[] {
  const now = new Date();
  return schedules
    .filter(s => !s.taken && !s.skipped && isAfter(new Date(s.scheduledAt), now))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, limit);
}

export function filterByDateRange(schedules: any[], startDate: Date, endDate: Date): any[] {
  return schedules.filter(s => {
    const schedDate = startOfDay(new Date(s.scheduledAt));
    return !isBefore(schedDate, startOfDay(startDate)) && !isAfter(schedDate, startOfDay(endDate));
  });
}
