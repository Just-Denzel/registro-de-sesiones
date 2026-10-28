const UTC_MIDNIGHT_SUFFIX = 'T00:00:00Z'
const CALENDAR_DATE_LENGTH = 'YYYY-MM-DD'.length

export function parseCalendarDate(calendarDate: string): Date {
  return new Date(`${calendarDate}${UTC_MIDNIGHT_SUFFIX}`)
}

export function formatCalendarDate(date: Date): string {
  return date.toISOString().slice(0, CALENDAR_DATE_LENGTH)
}

export function isInvalidDate(date: Date): boolean {
  return Number.isNaN(date.getTime())
}
