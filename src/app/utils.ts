
export const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, action: () => any) => {
    if (event.key === 'Enter') action();
}

