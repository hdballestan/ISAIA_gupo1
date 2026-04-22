import { describe, expect, it } from 'vitest'

import { matchCertificates, matchDocument } from './matcher'


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

describe('matchDocument — unverified extraction', () => {
  it('detects mentions not in catalog as unverified', () => {
    const catalog = [{ id: 1, regex_patterns: ['procuraduria'] }]
    const text = 'Adjuntar certificado de supervivencia vigente'
    const { matched, unverified } = matchDocument(text, catalog)
    expect(matched).toHaveLength(0)
    expect(unverified.length).toBeGreaterThan(0)
    expect(unverified[0].label).toMatch(/certificado de supervivencia/i)
  })

  it('does not duplicate items already matched by catalog', () => {
    const catalog = [{ id: 1, regex_patterns: ['antecedentes\\s+judiciales'] }]
    const text = 'Se requieren antecedentes judiciales para el proceso'
    const { matched, unverified } = matchDocument(text, catalog)
    expect(matched).toHaveLength(1)
    const labels = unverified.map((u) => u.label)
    const hasDuplicate = labels.some((l) => /antecedentes\s+judiciales/i.test(l))
    expect(hasDuplicate).toBe(false)
  })

  it('normalizes tildes and casing before matching', () => {
    const catalog = []
    const text = 'Certificado de SUPERVIVENCIA y Constancia de Afiliación'
    const { unverified } = matchDocument(text, catalog)
    expect(unverified.length).toBeGreaterThanOrEqual(1)
    const labels = unverified.map((u) => u.label)
    expect(labels.some((l) => /supervivencia/i.test(l))).toBe(true)
  })
})
