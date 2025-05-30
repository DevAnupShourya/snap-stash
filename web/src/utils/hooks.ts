import { useCallback, useEffect, useRef, useState } from "react";

export function useBackToTop(xAxis = 30) {
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

// Usage: