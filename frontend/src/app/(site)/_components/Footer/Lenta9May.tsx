"use client"

import { useMemo } from 'react';
import Image from 'next/image';

export function Lenta9May() {
  const isVisible = useMemo(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    return (month === 4 && day >= 25) || (month === 5 && day <= 12);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className="ribbon-wrapper">
        <a 
          href="https://pamyat-naroda.ru/" 
          target="_blank" 
          rel="external nofollow"
          className="ribbon-link"
        >
          <Image 
            src="/lenta9may.gif" 
            alt="Георгиевская лента"
            width={120}
            height={120}
            priority
          />
        </a>
      </div>
      
      <style jsx>{`
        .ribbon-wrapper {
          position: fixed;
          z-index: 20000;
          bottom: 0;
          left: 0;
          transform: scaleY(-1);
        }
        
        .ribbon-link {
          display: block;
          line-height: 0;
        }
        
        @media (max-width: 768px) {
          .ribbon-wrapper {
            bottom: 60px;
          }
        }
        
      `}</style>
    </>
  );
}
