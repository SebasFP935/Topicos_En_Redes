import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ 
  rating = 0, 
  onRate = null, 
  readonly = false, 
  size = 20,
  showCount = false,
  count = 0 
}) {
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hover || rating);
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              size={size}
              className={`${
                isActive 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        );
      })}
      {showCount && (
        <span className="text-sm text-gray-600 ml-2">
          ({count} {count === 1 ? 'calificación' : 'calificaciones'})
        </span>
      )}
    </div>
  );
}