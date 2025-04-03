export function timeStamp(createdAt: number): string {
  const now = new Date();
  const createdDate = new Date(createdAt);

  const diffMs = now.getTime() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffYears = now.getFullYear() - createdDate.getFullYear();

  if (diffYears >= 1) {
    return `${diffYears}년`;
  } else if (diffDays >= 1) {
    return `${diffDays}일`;
  } else if (diffHours >= 1) {
    return `${diffHours}시간`;
  } else if (diffMinutes >= 1) {
    return `${diffMinutes}분`;
  } else {
    return '방금';
  }
}
