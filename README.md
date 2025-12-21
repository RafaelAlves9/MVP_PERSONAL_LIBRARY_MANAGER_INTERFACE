# Biblioteca Pessoal (Front-end)

Aplicação React + Vite para explorar livros da OpenLibrary, visualizar detalhes, marcar leituras e gerenciar notas pessoais. Interface animada com MUI, Framer Motion, Tailwind e React Query, consumindo o backend em `http://localhost:5000`.

## Tecnologias principais
- React 19 + Vite + TypeScript
- MUI, Tailwind CSS, Framer Motion
- Axios + React Query
- React Router
- Zod para validação

## Pré-requisitos
- Node.js 22+ e npm
- Backend rodando em `http://localhost:5000` (endpoints `/books` e `/reads`)

## Instalação e execução local
1) Instalar dependências  
```bash
npm install
```

2) Rodar em desenvolvimento (porta 5173)  
```bash
npm run dev
```

3) Build de produção  
```bash
npm run build
```

4) Pré-visualizar build  
```bash
npm run preview
```

## Qualidade e testes
- Lint: `npm run lint`
- Testes (Vitest): `npm run test`

## Docker (frontend)
O Dockerfile na raiz constrói e serve o bundle estático na porta 3000:
```bash
docker build -t books-reads-frontend .
docker run -p 3000:3000 books-reads-frontend
```

Em um `docker-compose` compartilhado com o backend, adicione um serviço apontando para este Dockerfile, expondo `3000:3000` e definindo dependência do backend. O front continuará chamando o backend em `http://localhost:5000`.
