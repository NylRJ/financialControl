export type Purpose = 'Emergência' | 'Aposentadoria' | 'Feira' | 'Oportunidades' | 'Despesas pessoais' | 'Outros';
export type AssetClass = 'Tesouro Selic' | 'Tesouro IPCA+' | 'Tesouro Prefixado' | 'Ações BR' | 'FII' | 'ETF BR' | 'ETF exterior' | 'CDB/LCI/LCA' | 'Cripto' | 'Moeda estrangeira' | 'Outros';
export type Currency = 'BRL' | 'USD' | 'EUR';
export type MovementKind = 'openingBalance' | 'openingPosition' | 'income' | 'expense' | 'buy' | 'sell' | 'transfer';
export interface Account { id: string; name: string; purpose: Purpose; type: string; }
export interface Asset { id: string; ticker: string; name: string; class: AssetClass; purpose: Purpose; currency: Currency; maturity?: string; issuer?: string; }
export interface Quote { id: string; assetId: string; date: string; price: number; currency: Currency; fxRate: number; marketRate?: number; source: string; }
export interface Movement {
  id: string; date: string; kind: MovementKind; accountId?: string; toAccountId?: string;
  assetId?: string; amount?: number; quantity?: number; unitPrice?: number; currency?: Currency;
  fxRate?: number; fees?: number; purchaseRate?: number; purpose?: Purpose;
  source?: string; category?: string; description: string; contributionDate?: string; demo?: boolean;
}
export interface Goal { id: string; name: string; purpose: Purpose; target: number; deadline?: string; }
export interface FinanceData { accounts: Account[]; assets: Asset[]; movements: Movement[]; quotes: Quote[]; goals: Goal[]; }
export const PURPOSES: Purpose[] = ['Emergência','Aposentadoria','Feira','Oportunidades','Despesas pessoais','Outros'];
export const ASSET_CLASSES: AssetClass[] = ['Tesouro Selic','Tesouro IPCA+','Tesouro Prefixado','Ações BR','FII','ETF BR','ETF exterior','CDB/LCI/LCA','Cripto','Moeda estrangeira','Outros'];
export const KINDS: {value: MovementKind; label: string}[] = [
  {value:'income',label:'Receita'}, {value:'expense',label:'Despesa'}, {value:'buy',label:'Compra de ativo'},
  {value:'sell',label:'Venda de ativo'}, {value:'transfer',label:'Transferência entre contas'},
  {value:'openingBalance',label:'Saldo inicial'}, {value:'openingPosition',label:'Posição inicial (sem caixa)'}
];
