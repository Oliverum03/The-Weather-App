export function meterXsecToKmXhour(meterXsec: number): string {
    return `${(meterXsec * 3.6).toFixed(0)} km/h`;
}