import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import CertificateCard from './CertificateCard'
import TicketForm from './TicketForm'


describe('component smoke tests', () => {
  it('renders CertificateCard without errors', () => {
    const certificate = {
      id: 1,
      name: 'Antecedentes',
      issuer: 'Policia',
      portal_url: 'https://example.com',
    }
    const html = renderToString(
      <MemoryRouter>
        <CertificateCard certificate={certificate} />
      </MemoryRouter>
    )
    expect(html).toContain('Antecedentes')
  })

  it('renders TicketForm without errors', () => {
    const html = renderToString(<TicketForm />)
    expect(html).toContain('Enviar solicitud')
  })
})
