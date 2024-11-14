
export const handleKeyDown = <T extends HTMLElement>(event: React.KeyboardEvent<T>, action: () => any) => {
    if (event.key === 'Enter') action();
}

