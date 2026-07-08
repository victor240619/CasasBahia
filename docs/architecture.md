# Arquitetura completa

## Objetivo

Loja online com visual Casas Bahia, backend proprio, banco SQL gratuito e dois modos de pagamento:

- `gateway-proprio`: sandbox tokenizado para compras e assinaturas.
- `stripe`: checkout externo via Stripe quando `STRIPE_SECRET_KEY` estiver configurada no servidor.

## Stack

- Frontend: React + Vite + Tailwind.
- Backend: Node.js HTTP server nativo.
- Banco SQL: SQLite via `node:sqlite`, sem dependencia nativa extra.
- Deploy local/producao simples: `npm run build && npm start`.

## Persistencia SQL

O servidor cria `data/store.sqlite` automaticamente e salva o estado principal da loja na tabela `app_state`.

Dados persistidos:

- produtos;
- pedidos;
- pagamentos;
- assinaturas;
- auditoria;
- configuracao do gateway.

## Pagamentos

O gateway proprio nunca persiste PAN completo nem CVV. Ele valida Luhn, tokeniza e salva apenas:

- token;
- bandeira;
- final 4;
- validade;
- nome impresso.

Para pagamento real com gateway proprio, ainda e necessario contratar adquirente/processador e token vault certificado PCI DSS.

## Master Admin

Rota: `/master`

Controles:

- login local;
- produtos;
- pedidos;
- assinaturas;
- modo do gateway;
- auditoria;
- reset do banco local.

## Dominio gratis

O projeto inclui workflow GitHub Pages para publicar no dominio gratuito `github.io`.

Limite importante: GitHub Pages e estatico; ele nao roda o servidor Node/SQLite. A versao publica estatica usa fallback local do navegador quando a API SQL nao existe. Para SQL real publico, usar host Node com disco persistente.
