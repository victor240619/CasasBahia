# Deploy no Render

Este projeto pode rodar no Render como Web Service Node.

## Configuracao

O arquivo `render.yaml` define:

- build: `npm ci --no-audit --no-fund && npm run build`
- start: `npm start`
- health check: `/api/health`
- Node: `24.16.0`
- variaveis secretas obrigatorias:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`

## Observacao sobre banco

No plano gratuito do Render, o filesystem local nao deve ser tratado como persistente. O `STORE_DB_PATH` fica em `/tmp/casasbahia-store.sqlite`, suficiente para a loja rodar e criar sessoes Stripe reais, mas edicoes administrativas podem resetar quando o servico reiniciar.

Para persistencia real do painel admin, use um banco SQL persistente e migre a camada `server/database.js` para esse provedor antes de usar em producao de longo prazo.
