# Fases

## Fase 1 - App funcional local

- Mapear e corrigir o esqueleto vazio.
- Criar vitrine, carrinho e checkout.
- Criar modo `gateway-proprio` sandbox sem guardar dados sensiveis.
- Criar modo `stripe` preparado, sem chave secreta no browser.
- Criar assinaturas R$ 10, R$ 25 e R$ 40.
- Permitir ate 20 cartoes tokenizados por assinatura, com fallback e uma cobranca por ciclo.
- Criar Master Admin com produtos, pedidos, pagamentos, assinaturas e gateway.
- Criar testes de dominio para validacao de cartao, checkout e assinaturas.
- Rodar build e validacao visual.

## Fase 2 - Backend e banco

- Criar API backend.
- Migrar `localStorage` para banco.
- Implementar auth do admin com MFA.
- Implementar idempotencia de pedidos/pagamentos.
- Criar webhooks Stripe.
- Criar job mensal de assinaturas.
- Criar logs/auditoria.

## Fase 3 - Gateway proprio real

- Contratar adquirente/processador e token vault certificado.
- Implementar autorizacao/captura/refund/chargeback.
- Implementar antifraude, rate limit e monitoramento.
- Validar escopo PCI DSS com profissional qualificado.
- Criar ambiente sandbox e producao separados.

## Fase 4 - Deploy publico

- Configurar dominios, HTTPS, variaveis e segredos.
- Separar versoes publicas:
  - loja com gateway proprio.
  - loja com Stripe.
- Criar pipeline CI/CD.
- Criar backup e plano de rollback.

## Fase 5 - Operacao

- Relatorios financeiros.
- Controle de estoque avancado.
- Cupons, frete e impostos.
- Alertas para falha de assinatura.
- Exportacao contabil.
