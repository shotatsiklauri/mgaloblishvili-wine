export const SINGLETON_TYPES = new Set(['globalSettings', 'history', 'vineyards'])

export function isSingletonType(schemaType: string): boolean {
  return SINGLETON_TYPES.has(schemaType)
}
