import { describe, expect, it } from 'vitest'

import { matchCertificates } from './matcher'


describe('matchCertificates', () => {
  it('returns known certificate matches', () => {
    const catalog = [{ id: 1, regex_patterns: ['antecedentes\\s+judiciales'] }]
    const text = 'Solicitud de antecedentes judiciales para empleo'
    const matches = matchCertificates(text, catalog)
    expect(matches).toHaveLength(1)
    expect(matches[0].id).toBe(1)
  })

  it('returns empty array for unknown text', () => {
    const catalog = [{ id: 1, regex_patterns: ['procuraduria'] }]
    const text = 'Recibo de servicios publicos'
    const matches = matchCertificates(text, catalog)
    expect(matches).toEqual([])
  })
})
