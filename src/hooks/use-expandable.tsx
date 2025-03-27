import { useState, useCallback, useRef, useEffect } from "react";
import { useSpring } from "framer-motion";

export function useExpandable(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);
  const contentRef = useRef<HTMLDivElement>(null);
  const animatedHeight = useSpring(0, {
    stiffness: 300,
    damping: 30
  });

  useEffect(() => {
    if (contentRef.current) {
      const height = isExpanded ? contentRef.current.scrollHeight : 0;
      animatedHeight.set(height);
    }
  }, [isExpanded, animatedHeight]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return { isExpanded, toggleExpand, animatedHeight, contentRef };
}