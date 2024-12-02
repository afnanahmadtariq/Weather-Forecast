import { format, addDays } from 'date-fns';

export const formatDate = (date) => format(date, 'MMM dd, yyyy');
export const formatTime = (hour) => format(new Date().setHours(hour, 0), 'HH:mm');
export const getDayFromIndex = (index) => formatDate(addDays(new Date(), index));