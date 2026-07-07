# Arquitetura completa

## Objetivo

Transformar o esqueleto Base44/Vite em uma loja online com duas versoes de checkout:

- `gateway-proprio`: camada propria de checkout, tokenizacao e orquestracao de pagamento.
- `stripe`: camada alternativa preparada para Stripe Checkout/Payment Intents.

O app tambem precisa de um Master Admin para controlar vitrine, pedidos, assinaturas, modo de gateway e operacao comercial.

## Limite de seguranca para cartoes

O gateway proprio nao deve guardar PAN completo, CVV, trilha magnetica, nem dados sensiveis de autenticacao. A Fase 1 implementa tokenizacao local/sandbox e persiste apenas token, bandeira, final 4 e validade. Para capturar dinheiro real com gateway proprio, a Fase 3 precisa integrar uma adquirente/token vault certificada, TLS, controles PCI DSS e auditoria operacional.

Referencias usadas:

- PCI SSC: CVV/CVC nao pode ser armazenado depois da autorizacao.
- PCI SSC: PCI DSS se aplica a entidades que armazenam, processam ou transmitem dados de cartao.
- Stripe: Stripe.js/Elements tokenizam dados sensiveis para reduzir o escopo PCI.

## Modulos

### Frontend

- React + Vite.
- Tailwind + componentes existentes em `src/components/ui`.
- Rotas:
  - `/` e `/shop`: vitrine, carrinho, checkout e assinaturas.
  - `/master`: painel Master Admin.

### Dominio

- Produtos, estoque, pedidos, pagamentos e assinaturas.
- Planos recorrentes: R$ 10, R$ 25 e R$ 40.
- Assinatura com ate 20 metodos de pagamento tokenizados. A logica correta e tentar o principal e usar os demais como fallback, cobrando no maximo uma vez por ciclo.

### Pagamentos

- `gateway-proprio`: validacao, Luhn, deteccao de bandeira, token sandbox e simulacao de autorizacao.
- `stripe`: adaptador preparado. Na Fase 1 fica em estado `pending_provider`, porque a criacao real de PaymentIntent/Subscription precisa de backend e segredo do Stripe fora do navegador.

### Persistencia

- Fase 1: `localStorage`, para rodar agora sem infraestrutura.
- Fase 2: API propria + banco relacional.
- Fase 3: token vault/adquirente real, webhooks, filas e observabilidade.

### Master Admin

- Resumo comercial.
- CRUD de produtos.
- Historico de pedidos, pagamentos e assinaturas.
- Configuracao do modo publico: gateway proprio ou Stripe.
- Politicas do gateway: tokenizacao apenas, sem CVV/PAN persistido.

## Backend futuro

- API REST/JSON ou tRPC.
- Banco: PostgreSQL em producao, SQLite apenas para dev/local.
- Autenticacao: admin com MFA, sessoes seguras, RBAC.
- Segredos: variaveis de ambiente e cofre, nunca no frontend.
- Jobs: cobranca recorrente mensal e retentativas controladas.
- Webhooks: Stripe/adquirente com assinatura e idempotencia.

## Deploy futuro

- Frontend em Vercel/Netlify ou VPS com Nginx.
- Backend em VPS/Render/Fly/Vercel Functions.
- Banco gerenciado.
- HTTPS obrigatorio.
- Logs sem dados sensiveis.
