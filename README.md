# Qualilan · proposta de novo site

Demonstração de um novo site para a **Qualilan**, distribuidora de infraestrutura de rede, fibra óptica, CFTV e controle de acesso com cinco unidades em SP e MG.

> Projeto de proposta, feito por Henry Marques. Não é o site oficial da Qualilan. Marcas, fotos e textos da empresa aparecem apenas para a apresentação.

**Ver o site:** _link da Vercel_

## O que o site faz

- **Catálogo sem e-commerce:** mais de 180 produtos com busca, filtro por marca, ordenação e paginação.
- **Orçamento pelo WhatsApp:** o cliente monta uma lista (salva no navegador) e envia tudo em uma mensagem pronta.
- **Painel de edição** em `/admin`: a equipe da Qualilan cadastra e edita produtos e fotos, com login por e-mail e senha.
- **Institucional:** mapa animado das unidades com posições reais, cases em vídeo, avaliações do Google, página Sobre com conteúdo do Instagram e do LinkedIn, e páginas de políticas.

## Destaques técnicos

- **Next.js 16** (App Router, Turbopack, Cache Components): páginas pré-renderizadas com `"use cache"` e revalidação por tag quando um produto é salvo no painel.
- **Supabase:** Postgres com RLS (só administradores escrevem), Auth e Storage para as fotos dos produtos.
- **Tailwind CSS v4** com os tokens do manual da marca.
- **Animações só com CSS:** animações ligadas à rolagem (`animation-timeline`), fibras SVG com pulsos de luz e marquee de marcas. Tudo desliga com `prefers-reduced-motion`. Não usa nenhuma biblioteca de animação.
- **Acessibilidade e SEO:** HTML semântico, foco visível, JSON-LD nos produtos, imagem de compartilhamento (OG) gerada no próprio Next.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com a URL e a chave publishable do seu projeto Supabase
npm run dev
```

Para recriar o banco, rode `supabase/migrations/*.sql` e depois `supabase/seed.sql` no seu projeto Supabase.

## Estrutura

```
app/(site)/     páginas públicas (home, catálogo, produto, sobre, políticas)
app/admin/      painel de edição (protegido pelo proxy.ts)
components/     header, footer, mapa, lista de orçamento, cases etc.
lib/            dados do site, catálogo, clientes Supabase
supabase/       migrations e seed
```
