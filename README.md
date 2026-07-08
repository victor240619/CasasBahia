# Casas Bahia Store

Loja online React/Vite com backend Node proprio e banco SQL gratuito em SQLite.

## Rodar localmente

```bash
npm install
npm run build
npm start
```

Servidor:

- App: `http://127.0.0.1:8787`
- Health/API: `http://127.0.0.1:8787/api/health`
- Banco SQL: `data/store.sqlite`

## Desenvolvimento frontend

Em uma janela rode a API:

```bash
npm start
```

Em outra rode o Vite:

```bash
npm run dev
```

O Vite faz proxy de `/api` para `http://127.0.0.1:8787`.

## Admin

- URL: `/master`
- Email: `casasb@casasbahia.com`
- Senha: configurada no codigo como hash SHA-256, nao texto puro.

## Pagamentos

- Gateway proprio: sandbox tokenizado, sem armazenar numero completo do cartao nem CVV.
- Stripe: usa a API propria `/api/stripe/*`; requer `STRIPE_SECRET_KEY` no ambiente do servidor.

## Publicacao gratis

O workflow em `.github/workflows/pages.yml` publica uma versao estatica no GitHub Pages, usando o dominio gratis `github.io`.

Observacao: GitHub Pages nao roda backend Node nem SQLite. Para SQL real em publico, use um host Node gratuito/baixo custo com disco persistente e rode `npm start`.

## Validacao

```bash
npm run check
```
