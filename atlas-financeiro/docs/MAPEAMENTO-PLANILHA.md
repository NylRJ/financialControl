# Migração conceitual da planilha para o Atlas Financeiro

Fonte: **Controle_Financeiro_Dashboard_Demonstracao.xlsx**, modelo demonstrativo com 13 abas (criado em 02/11/2026). Todos os dados da demonstração do software são fictícios.

| Aba da planilha | Entidade / tela do app | Observações |
|---|---|---|
| COMECE AQUI | Configurações + README | Onboarding, aviso de dados demonstrativos |
| PAINEL | Visão geral | KPIs e gráficos derivados dos registros |
| LANÇAMENTOS | `movements` | Data, tipo, conta, ativo, PU, moeda, câmbio, taxas, categoria, origem, finalidade e data do aporte |
| ATIVOS | `assets`, calculado em `positions()` | Classe, objetivo, vencimento, preço médio e posição |
| COTAÇÕES | `quotes` | Valor unitário, moeda, FX, taxa de mercado, fonte e data |
| CONTAS | `accounts` + `accountBalances()` | Separação do caixa líquido por finalidade |
| TESOURO | Tela Tesouro Direto | Posição, média de compra, PU atual e marcação a mercado bruta |
| FEIRA | Tela Caixa da Feira | Receita pela fonte Feira, custo pela finalidade Feira, resultado operacional |
| METAS | `goals` | Emergência, aposentadoria, feira e demais objetivos |
| HISTÓRICO | `monthly()` | Evolução mensal sem misturar investimento com despesa |
| LISTAS | `types.ts` | Tipos, classes, moedas, finalidades e categorias |
| EXEMPLOS | `demo.ts` | Demonstração explicitamente fictícia |
| PROJEÇÕES | `project()` | Três cenários e inputs separados |

## Decisões técnicas

1. Todas as operações de caixa têm **uma única origem de verdade**: os documentos de `movements`. O painel nunca salva saldos calculados manualmente.
2. Na compra de ativo, o caixa diminui, mas o patrimônio migra para o investimento. Na venda, ocorre o inverso. Transferência interna soma zero no patrimônio global.
3. `openingPosition` representa posição anterior à implantação sem registrar saída fictícia de dinheiro.
4. Fica explícita a separação de `date` (data da compra) e `contributionDate` (data do aporte).
5. Cotações e câmbio são manuais nesta versão. Histórico de rentabilidade real precisa de série temporal de preços; usar o preço atual retrospectivamente seria incorreto.
6. O Firestore usa coleções filhas de `users/{uid}`, com regras que negam leitura de terceiros.

## Cobertura e lacunas atuais

- A planilha inspirou o **modelo e a experiência**, mas a importação automática de todas as linhas XLSX com validação e deduplicação ainda não foi implementada. O app inicia com dados fictícios próprios para demonstração.
- Custos médios e ganhos são **brutos** e simplificados; eventos corporativos, cupons, títulos complexos, corretagem por ativo e apuração tributária ainda precisam de modelagem posterior.
- Sem projeto Firebase real, há interface de demonstração e código de integração, mas **não existe banco de produção conectado**.
- Sem `npm install` resolvido, ainda é necessário verificar o build do frontend no CI; os testes do núcleo financeiro são executáveis com Node 22.
