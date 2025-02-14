export function formatDate(date: Date): string {
  return new Date(date).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
}
