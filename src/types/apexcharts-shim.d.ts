/* eslint-disable @typescript-eslint/no-explicit-any */

// src/types/apexcharts-shim.d.ts
/**
 * Shim para apexcharts:
 * diz ao TS que existe um módulo 'apexcharts'
 * e que ele exporta um tipo ApexOptions qualquer.
 */
declare module 'apexcharts' {
  // você pode expandir isso com as props que usar,
  // mas um `any` já resolve o erro:
  export type ApexOptions = any

  // caso use series: ApexOptions['series'], 
  // garanta que exista essa propriedade:
  export interface ApexOptions {
    series?: any
    [key: string]: any
  }
}