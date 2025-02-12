export function getDayorNightIcons(icon: string, date: string): string {
    const hour = new Date(date).getHours();
    const isDay = (hour > 6 && hour < 18);
    return isDay? icon.replace('n', 'd'): icon.replace('d', 'n');
} 