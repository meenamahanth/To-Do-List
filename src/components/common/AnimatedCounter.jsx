import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }

    const range = end - start;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercentage = Math.min(progress / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progressPercentage * (2 - progressPercentage);
      
      setCount(Math.floor(start + range * easedProgress));

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}</span>;
};

export default AnimatedCounter;
