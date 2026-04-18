import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import CertificateTable from './CertificateTable'
import TicketForm from './TicketForm'


describe('component smoke tests', () => {
  it('renders CertificateTable without errors', () => {
    const certificates = [
      {
        id: 1,
        name: 'Antecedentes',
        issuer: 'Policia',
        portal_url: 'https://example.com',
        purposes: [],
      },
    ]
    const html = renderToString(
      <MemoryRouter>
        <CertificateTable certificates={certificates} />
      </MemoryRouter>
    )
    expect(html).toContain('Antecedentes')
  })

  it('renders TicketForm without errors', () => {
    const html = renderToString(<TicketForm />)
    expect(html).toContain('Enviar solicitud')
  })
})
