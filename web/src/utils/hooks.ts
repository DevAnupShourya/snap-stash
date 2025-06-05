import { useCallback, useEffect, useRef, useState } from "react";

export function useBackToTop(xAxis = 10) {
    const [isVisible, setIsVisible] = useState(false);
    const scrollableRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = scrollableRef.current;
        if (!element) return;

        const handleScroll = () => {
            setIsVisible(element.scrollTop > xAxis);
        };

        element.addEventListener("scroll", handleScroll, { passive: true });
        return () => element.removeEventListener("scroll", handleScroll);
    }, [xAxis]);

    const scrollToTop = useCallback(() => {
        scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return { isVisible, scrollableRef, scrollToTop };
}


export function useCopyToClipboard(txtToCopy: string, resetAfterMs = 3000) {
    const [isCopied, setIsCopied] = useState(false);

    const copy = useCallback(() => {
        navigator.clipboard.writeText(txtToCopy)
            .then(() => setIsCopied(true))
            .catch((err) => {
                console.error('Failed to copy!', err);
            });
    }, [txtToCopy]);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, resetAfterMs);
            return () => clearTimeout(timer);
        }
    }, [isCopied, resetAfterMs]);

    return { isCopied, copy };
}

export const useDebounce = (fn: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback((...args: any[]) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => fn(...args), delay);
    }, [fn, delay]);
};
