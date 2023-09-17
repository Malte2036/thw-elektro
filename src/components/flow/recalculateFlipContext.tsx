import React from "react";

const RecalculateFlipContext = React.createContext({
    flip: 0,
    recalculateFlip: () => {
        console.warn("recalculateFlipContext not initialized");
    },
});

export function useRecalculateFlip() {
    return React.useContext(RecalculateFlipContext);
}

export function RecalculateFlipProvider({ children }: { children: React.ReactNode }) {
    const [flip, setFlip] = React.useState(0);
    const recalculateFlip = React.useCallback(() => setFlip(Math.random()), []);
    return (
        <RecalculateFlipContext.Provider value={{ flip, recalculateFlip }}>
            {children}
        </RecalculateFlipContext.Provider>
    );
}