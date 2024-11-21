
export const handleKeyDown = <T extends HTMLElement>(event: React.KeyboardEvent<T>, action: () => any) => {
    if (event.key === 'Enter') action();
}

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', // Abbreviated weekday (e.g., 'Wed')
    year: 'numeric',
    month: 'short', // Abbreviated month (e.g., 'Nov')
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });