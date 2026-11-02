# Atlas Financeiro — React + Firebase

**MVP v0.1.0**, derivado do modelo de controle integrado de caixa e investimentos (13 abas) entregue em novembro/2026. Interface em português, com painel de indicadores, gráficos, lançamentos e projeções.

> **Atenção:** os lançamentos e preços de exemplo são inteiramente fictícios, não representam saldos reais nem cotações. O modo demonstração sem Firebase mantém alterações apenas na memória da página.

## Recursos disponíveis

| Módulo | MVP |
|---|---|
| Visão geral | KPIs, receitas x despesas, resultado, carteira, alocação por objetivo |
| Livro caixa | Receitas (servidor, feira, autônomo etc.), despesas, transferências, saldo inicial, exportação CSV |
| Investimentos | Ativos de diversas classes, compras, vendas, posição inicial, preço médio ponderado e cotação manual |
| Tesouro Direto | PU de aquisição, PU de mercado, taxa de compra, taxa cadastrada, MTM bruto |
| Feira | Faturamento, despesas da finalidade Feira, resultado e saldo em contas exclusivas |
| Objetivos | Emergência, aposentadoria e capital de giro; acompanhamento por finalidade |
| Projeções | Simulação com três hipóteses anuais editáveis e aporte mensal |
| Firebase | Google Authentication, isolamento por UID, sincronização Firestore com onSnapshot, regras de segurança |

## Iniciar localmente

Requisitos: Node.js 22 ou superior, npm.

```bash
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173`. **Sem `.env` preenchido, a interface abre em demonstração fictícia**, mas não persiste no Firestore.

## Ligar ao Firebase (etapa necessária para persistência real)

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. Adicione um aplicativo Web e copie a configuração para `.env` usando `.env.example`. **Não** use credenciais de serviço na interface.
3. Em Authentication > Sign-in method, habilite **Google** e configure domínios autorizados (localhost e domínio de produção).
4. Crie o Cloud Firestore em modo de produção; escolha região apropriada à operação.
5. Instale Firebase CLI e associe o projeto: `npx firebase-tools login`, `npx firebase-tools use --add`.
6. Publique regras e índices: `npx firebase-tools deploy --only firestore:rules,firestore:indexes`.
7. Execute `npm run build`; para publicar no Hosting: `npx firebase-tools deploy --only hosting`.
8. Abra a aplicação, clique em **Entrar com Google** em Configurações e cadastre suas contas, ativos e lançamentos.
9. Opcional: em base **vazia**, use **Popular Firestore com exemplos** para testar. Este comando exige confirmação explícita e não roda automaticamente.

**A configuração do Firebase no navegador não concede, por si, acesso a dados**; a segurança depende das regras do Firestore. A regra incluída limita operações a `users/{uid}` em coleções permitidas. Considere regras mais detalhadas para validação de cada campo antes de produção financeira.

## Organização dos dados

```text
users/{uid}/accounts/{id}
users/{uid}/assets/{id}
users/{uid}/movements/{id}
users/{uid}/quotes/{id}
users/{uid}/goals/{id}
```

- Os registros possuem IDs estáveis; cotações referenciam ativos por ID e unidades de investimento vêm das compras/vendas/posições iniciais.
- Compras **não são despesas**; transferências entre contas **não contam como receita**.
- `openingPosition` não altera saldos de conta e serve para importar histórico antigo sem simular nova movimentação.
- `contributionDate` identifica a data de aporte, separada da compra.
- Valores em moeda estrangeira usam `unitPrice × fxRate`; câmbio em BRL por unidade da moeda.
- Preço médio: custo total remanescente / unidades, com abatimento proporcional nas vendas. Ganhos são brutos.
- Sem cotação, o patrimônio usa custo de aquisição como **aproximação**, não como valor de mercado confirmado.
- Atenção: ainda não estão cobertos fracionamentos, bonificações, cupons/amortizações com tratamento contábil completo, proventos por ativo, IR, come-cotas, múltiplas moedas de base ou tax-lots fiscais.

## Estrutura de arquivos

```text
src/App.tsx                  Navegação e telas
src/components/Forms.tsx    Formulários de operações, ativos, cotações e contas
src/domain/types.ts         Entidades e classificações
src/domain/finance.ts       Regras e cálculos financeiros puros
src/domain/finance.test.ts  Testes de caixa, transferência, custo médio, câmbio e projeção
src/data/demo.ts            Massa de dados fictícia (não contém dados do usuário)
src/lib/firebase.ts         Conexão Firebase + Google Auth
src/lib/store.ts            CRUD e listeners Firestore
firestore.rules             Isolamento de dados por usuário
firebase.json               Firestore e Hosting
```

## Validação

```bash
npm run test
npm run typecheck
npm run build
```

O teste do domínio financeiro não precisa de conexão Firebase. **Não execute importação fictícia em conta que já tenha lançamentos reais.**

## Próximas sprints

- **Sprint 2**: importador XLSX com prévia e deduplicação, reconciliação com extratos reais, edição em lote, classificação por centro de custo.
- **Sprint 3**: histórico de cotações e gráficos de patrimônio por data (sem lookahead), cálculo de TIR/XIRR e IR de ativos, regras de tipos de proventos.
- **Sprint 4**: importação automática por integrações consentidas, alertas de vencimentos e reserva, relatórios exportáveis, audit trail e backups versionados.

## Privacidade e GitHub

Não versionar `.env`, credenciais privadas, extratos reais ou planilhas financeiras pessoais. O código pode estar em repositório público **porque os exemplos são sintéticos**, enquanto os dados reais ficam protegidos em Firestore (desde que as regras sejam publicadas corretamente).

## Sprint 02 — fluxo guiado e contas (branch de implementação)

A proposta AF-001/AF-002 introduz apresentação inicial, onboarding para usuário autenticado com base vazia, módulo Contas e Carteiras e composição de patrimônio consultável. Em movimentações, a falta de conta tem explicação e cadastro rápido sem perder o preenchimento. Veja `docs/SPRINT02-UX-ACCOUNTS.md` para critérios de aceite e pendências.

A versão no Firebase Hosting **não muda automaticamente** quando a branch recebe um commit. Antes de publicar, execute `npm install`, `npm run test`, `npm run typecheck`, `npm run build` e os testes de autenticação/persistência com dados de teste. Não importe demonstração para uma base contendo movimentos reais.
