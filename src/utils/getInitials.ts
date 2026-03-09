export function getInitials(name: string): string;
export function getInitials(first: string, last: string): string;
export function getInitials(firstOrName: string, last?: string): string {
  if (last !== undefined) {
    return `${firstOrName?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
  }
  return (
    firstOrName
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? ""
  );
}
