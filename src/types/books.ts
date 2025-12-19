export type Book = {
  externalId: string
  title: string
  author?: string
  cover?: string
  firstPublishYear?: number
}

export type BookDetails = Book & {
  description?: string
  subjects?: string[]
  pages?: number
}

