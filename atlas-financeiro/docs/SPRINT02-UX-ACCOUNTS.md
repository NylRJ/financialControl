# AF-001 + AF-002 — Primeira implementação (02/11/2026)

Status: **implementado em branch para revisão**, não publicado em Firebase Hosting e não validado E2E.

## Problema de origem

Uma pessoa autenticada com coleção `accounts` vazia abria um formulário com seletor obrigatório sem opções. Cadastro de conta estava oculto em Configurações. Não havia jornada inicial nem explicação sobre de onde vinha o patrimônio.

## Fluxo implementado

1. Visitante abre uma apresentação clara do Atlas e escolhe explorar demo ou entrar com Google. Demo continua local e é explicitamente fictícia.
2. Após autenticação e carregamento das cinco coleções do Firestore, a página Visão Geral exibe orientação se a jornada estiver incompleta.
3. Sem contas, CTA 'Criar primeira conta'; conta registrada em `users/{uid}/accounts` pelo código existente de `saveEntity`.
4. Com conta, saldo inicial opcional (operação `openingBalance` — não é receita).
5. Registrar a primeira receita; o onboarding deixa de aparecer e o usuário visualiza a visão geral.
6. Botão 'Como o patrimônio total foi calculado?' expande composição de contas e ativos, com indicação de preço estimado sem cotação.
7. Módulo 'Contas e carteiras' no menu com lista de contas, saldo calculado, edição e atalhos para saldo inicial/receita.
8. No formulário de movimentação, uma conta ausente é explicada com CTA de cadastro rápido no mesmo formulário; ao salvar a conta, ela é selecionada sem perder o rascunho. Ações Firestore retornam confirmação antes de fechar a experiência.

## Regras preservadas

- Transferências não são receitas e compras não são despesas.
- Cadastro de conta não registra saldo; apenas `openingBalance` ou outras movimentações o fazem.
- `openingPosition` não movimenta caixa.
- Alterar finalidade principal da conta reclassifica os gráficos, não apaga movimentos.
- Dados fictícios permanecem separados dos dados pessoais autenticados; importar demonstração continua exigindo confirmação.

## Testes executados

`npm run test` = 10/10 (cinco financeiros + cinco onboarding). `typescript.transpileModule` retornou zero erros de sintaxe para App.tsx, Forms.tsx, onboarding.ts e onboarding.test.ts.

**Ainda sem verificação:** `npm install`, `npm run build` completos neste ambiente (sem acesso ao registry); E2E com navegador; uso autenticado contra o Firestore; emulador de regras; responsividade em dispositivos reais; auditoria de acessibilidade e performance. Não publicar como pronto para produção antes dos checks.

## Critérios de aceite / QA manual

- [ ] Login Google consegue abrir a base vazia e mostra onboarding.
- [ ] Clique 'Criar primeira conta' grava registro e volta para passo 2 sem recarregar.
- [ ] Saldo inicial não altera receita mensal.
- [ ] Primeira receita grava e sobrevive a refresh/logout/login.
- [ ] Indicador patrimônio abre composição correta por conta/ativo.
- [ ] Formulário sem contas mostra CTA, cria e seleciona conta preservando descrição/valor.
- [ ] Conta editada persiste sem duplicar ID ou lançamentos.
- [ ] Usuário A não lê/grava dados do usuário B (emulador Firestore).
- [ ] Modo visitante não grava Firebase; exportar CSV é download local.
- [ ] Navegação por teclado, modais, foco, contraste e telas móveis testados.

## Pendências e riscos

- O formulário ainda não oferece cadastro contextual de ativos (AF-003 permanece parcialmente aberta).
- Exclusão, reclassificação de ativos por meta, caixa por centro de custo, edição/estorno e trilha de auditoria permanecem em backlog.
- `auth/popup-closed-by-user` passa a mostrar mensagem compreensível, mas não houve E2E.
- As regras Firestore precisam passar em testes de emulador e validar schema antes de entrada de dados reais.

## Governança

Cérebro: https://drive.google.com/drive/folders/1uwuwK7NfUmQvjxuRleieCzh0XMaSy46U
Issues: https://github.com/NylRJ/financialControl/issues/2 e https://github.com/NylRJ/financialControl/issues/3
