'use client'

import { useState, useEffect } from 'react'
import styles from './Garland.module.css'

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setWindowDimensions({ width, height })
  
    function handleResize() {
      const { innerWidth: width, innerHeight: height } = window;
      setWindowDimensions({ width, height })
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export function Garland() {
  const { height, width } = useWindowDimensions();
  return (
    <div className={styles.garland}>
      {[...Array(Math.ceil(width/289))].map((_, i) => (
        <div className={styles.node} key={i}>
          <svg className={`${styles['GarlandParts__item']} ${styles['GarlandParts__item1']}`} width={64} height={20} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5c21.703 3.116 34.075 4 56 4" stroke="currentColor" /><g opacity=".8" filter="url(#a)"><path className={styles['GarlandParts__shadow']} d="M9.5 14c-1.313 0-2.102-1-2.89-2.75-.745-1.655-1.056-3.784.54-4.75.713-.432 1.044-.5 2.35-.5s1.637.068 2.35.5c1.596.966 1.285 3.095.54 4.75C11.602 13 10.813 14 9.5 14z" fill="currentColor" /></g><path className={styles['GarlandParts__lamp']} d="M9.5 13c-1.313 0-2.102-1-2.89-2.75-.745-1.655-1.056-3.784.54-4.75.713-.432 1.044-.5 2.35-.5s1.637.068 2.35.5c1.596.966 1.285 3.095.54 4.75C11.602 12 10.813 13 9.5 13z" fill="currentColor" /><defs><filter id="a" x={0} y={0} width={19} height={20} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity={0} result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation={3} result="effect1_foregroundBlur_116_127907" /></filter></defs></svg>
          <svg className={`${styles['GarlandParts__item']} ${styles['GarlandParts__item2']}`} width={67} height={21} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M66 3S31.925 7 10 7" stroke="currentColor" /><g opacity=".8" filter="url(#a)"><path className={styles['GarlandParts__shadow']} d="M7.373 13.688c-1.114-.696-1.252-1.961-.993-3.863.245-1.798 1.109-3.768 2.974-3.742.835.011 1.151.13 2.258.821 1.108.692 1.352.925 1.729 1.67.841 1.665-.551 3.305-2.06 4.314-1.596 1.066-2.794 1.497-3.908.8z" fill="currentColor" /></g><path className={styles['GarlandParts__lamp']} d="M7.903 12.84c-1.114-.695-1.252-1.961-.993-3.863.245-1.798 1.109-3.768 2.974-3.742.835.011 1.151.13 2.258.821 1.108.692 1.352.925 1.729 1.67.84 1.665-.551 3.305-2.06 4.314-1.596 1.066-2.794 1.497-3.908.8z" fill="currentColor" /><defs><filter id="a" x=".268" y=".082" width="19.326" height="19.945" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity={0} result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation={3} result="effect1_foregroundBlur_116_127912" /></filter></defs></svg>
          <svg className={`${styles['GarlandParts__item']} ${styles['GarlandParts__item3']}`} width={67} height={21} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 8s28.088 2.196 56 3.334" stroke="currentColor" /><g opacity=".8" filter="url(#a)"><path className={styles['GarlandParts__shadow']} d="M13.466 14.144c-1.006.845-2.252.585-3.981-.249-1.634-.789-3.241-2.22-2.64-3.985.269-.79.479-1.055 1.479-1.894 1-.84 1.297-1 2.122-1.128 1.844-.285 2.973 1.546 3.466 3.292.521 1.847.56 3.12-.446 3.964z" fill="currentColor" /></g><path className={styles['GarlandParts__lamp']} d="M12.823 13.378c-1.006.844-2.252.585-3.98-.25C7.207 12.34 5.6 10.91 6.201 9.145c.269-.79.479-1.055 1.48-1.894 1-.84 1.296-1 2.121-1.128 1.844-.285 2.974 1.546 3.466 3.292.522 1.847.56 3.12-.446 3.964z" fill="currentColor" /><defs><filter id="a" x=".716" y=".859" width="19.556" height="19.805" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity={0} result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation={3} result="effect1_foregroundBlur_116_127917" /></filter></defs></svg>
          <svg className={`${styles['GarlandParts__item']} ${styles['GarlandParts__item4']}`} width={66} height={20} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 9.334c9.757.398 19.493.666 28 .666 10.49 0 19.512-.09 28-.313" stroke="currentColor" /><g opacity=".8" filter="url(#a)"><path className={styles['GarlandParts__shadow']} d="M14.517 7.485c.677 1.126.225 2.316-.869 3.893-1.034 1.491-2.699 2.855-4.35 1.985-.737-.39-.966-.638-1.638-1.758-.673-1.119-.785-1.437-.782-2.272.006-1.866 1.992-2.695 3.794-2.908 1.906-.226 3.169-.066 3.845 1.06z" fill="currentColor" /></g><path className={styles['GarlandParts__lamp']} d="M13.66 8c.676 1.126.225 2.316-.869 3.893-1.034 1.491-2.699 2.855-4.35 1.985-.737-.39-.966-.638-1.638-1.758-.673-1.119-.785-1.437-.782-2.272.006-1.866 1.991-2.695 3.793-2.908 1.906-.226 3.17-.066 3.846 1.06z" fill="currentColor" /><defs><filter id="a" x=".878" y=".337" width="19.958" height="19.298" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity={0} result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation={3} result="effect1_foregroundBlur_116_127922" /></filter></defs></svg>
          <svg className={`${styles['GarlandParts__item']} ${styles['GarlandParts__item5']}`} width={68} height={21} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M67.5 7c-22.251 2.124-37.912 3.21-56 3.687" stroke="currentColor" /><g opacity=".8" filter="url(#a)"><path className={styles['GarlandParts__shadow']} d="M7.538 7.484c1.007-.845 2.253-.585 3.982.249 1.634.788 3.241 2.219 2.64 3.985-.27.79-.48 1.055-1.48 1.894-1 .84-1.297 1-2.121 1.128-1.844.285-2.974-1.546-3.467-3.292-.52-1.848-.56-3.12.446-3.964z" fill="currentColor" /></g><path className={styles['GarlandParts__lamp']} d="M8.181 8.25c1.006-.845 2.253-.585 3.981.249 1.635.788 3.242 2.219 2.64 3.985-.268.79-.478 1.055-1.479 1.894-1 .84-1.297 1-2.122 1.128-1.843.285-2.973-1.546-3.466-3.292-.52-1.847-.56-3.12.446-3.964z" fill="currentColor" /><defs><filter id="a" x=".732" y=".965" width="19.556" height="19.805" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity={0} result="BackgroundImageFix" /><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation={3} result="effect1_foregroundBlur_116_127927" /></filter></defs></svg>
        </div>
      ))}
    </div>
  )
}
