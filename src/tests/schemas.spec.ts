import { describe, expect, it } from 'vitest'
import { toBook, toBookDetails, toReadEntry, toPaginated } from '@/services/schemas'

describe('schemas', () => {
  it('normaliza book básico', () => {
    const result = toBook({
      external_id: 'OL123',
      title: 'Clean Code',
      author_name: 'Robert C. Martin',
      first_publish_year: 2008,
    })

    expect(result).toEqual({
      externalId: 'OL123',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      cover: undefined,
      firstPublishYear: 2008,
    })
  })

  it('normaliza detalhes com descrição em objeto', () => {
    const result = toBookDetails({
      key: 'OL999',
      title: 'DDD',
      description: { value: 'Domínio e linguagem ubíqua' },
      number_of_pages: 480,
      subjects: ['arquitetura', 'design'],
    })

    expect(result.description).toContain('Domínio')
    expect(result.pages).toBe(480)
    expect(result.subjects).toContain('arquitetura')
  })

  it('normaliza read entry', () => {
    const result = toReadEntry({
      id: 1,
      external_id: 'OL-1',
      title: 'Livro',
      author: 'Autor',
      note: 'Boa leitura',
      created_at: '2025-01-01',
    })

    expect(result.id).toBe('1')
    expect(result.note).toBe('Boa leitura')
  })

  it('normaliza paginação com fallback', () => {
    const result = toPaginated(
      {
        items: [{ external_id: 'OL-2', title: 'Livro 2' }],
        page: 2,
        totalPages: 4,
        total: 70,
        limit: 20,
      },
      toBook,
    )

    expect(result.items[0].externalId).toBe('OL-2')
    expect(result.totalPages).toBe(4)
    expect(result.limit).toBe(20)
  })
})

