import type { Account, Asset, FinanceData, Movement, Quote } from './types.ts';

export const money = (n: number) => new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(Number.isFinite(n)?n:0);
export const number = (n: number, digits=2) => new Intl.NumberFormat('pt-BR', {maximumFractionDigits:digits}).format(Number.isFinite(n)?n:0);
export const pct = (n: number) => `${number(n*100,1)}%`;
export const monthKey = (date: string) => date.slice(0,7);
export const monthName = (month: string) => { const [y,m] = month.split('-'); return `${['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][Number(m)-1]}/${y?.slice(2)}`; };
export const operationGross = (m: Movement) => (m.quantity ?? 0)*(m.unitPrice ?? 0)*(m.fxRate ?? 1);
export const cashDelta = (m: Movement, accountId: string): number => {
  if(m.kind === 'transfer') return (m.toAccountId === accountId ? (m.amount ?? 0) : 0) - (m.accountId === accountId ? (m.amount ?? 0) : 0);
  if(m.accountId !== accountId) return 0;
  switch(m.kind) {
    case 'openingBalance': case 'income': return m.amount ?? 0;
    case 'expense': return -(m.amount ?? 0);
    case 'buy': return -operationGross(m)-(m.fees ?? 0);
    case 'sell': return operationGross(m)-(m.fees ?? 0);
    default: return 0;
  }
};
export function accountBalances(accounts: Account[], movements: Movement[]) {
  return accounts.map(a => ({...a, balance: round(movements.reduce((sum,m)=>sum+cashDelta(m,a.id),0))}));
}
const round = (n:number) => Math.round((n+Number.EPSILON)*1e8)/1e8;
export interface Position {asset:Asset; units:number; cost:number; avgCost:number; price:number; marketValue:number; unrealized:number; realized:number; quoteDate?:string; quoted:boolean; lastBuyRate?:number; lastMarketRate?:number;}
export function positions(assets:Asset[], movements:Movement[], quotes:Quote[]): Position[] {
  const sorted=[...movements].filter(m=>m.assetId).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  const result = assets.map(asset=>{
    let units=0, cost=0, realized=0; let lastBuyRate: number|undefined;
    for(const m of sorted.filter(m=>m.assetId===asset.id)) {
      const qty=m.quantity??0;
      if(m.kind==='buy'||m.kind==='openingPosition') {
        cost+=m.kind==='openingPosition' && m.amount!==undefined && m.amount>0 ? m.amount : operationGross(m)+(m.fees??0);
        units+=qty;
        if(m.purchaseRate!==undefined) lastBuyRate=m.purchaseRate;
      }
      if(m.kind==='sell'&&qty>0&&units>0) {
        const sold=Math.min(qty,units), avg=cost/units;
        realized+=operationGross({...m,quantity:sold})-(m.fees??0)-sold*avg;
        cost=Math.max(0,cost-sold*avg); units-=sold;
      }
    }
    const latest=[...quotes].filter(q=>q.assetId===asset.id).sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id))[0];
    const avgCost=units>0?cost/units:0;
    const price=latest ? latest.price*latest.fxRate : avgCost;
    const marketValue=units*price;
    return {asset,units:round(units),cost:round(cost),avgCost:round(avgCost),price:round(price),marketValue:round(marketValue),unrealized:round(marketValue-cost),realized:round(realized),quoted:!!latest,quoteDate:latest?.date,lastBuyRate,lastMarketRate:latest?.marketRate};
  });
  return result.filter(p=>p.units>0||p.realized!==0);
}
export interface MonthRow {month:string; income:number; expense:number; net:number; fairIncome:number; fairExpense:number; fairResult:number; purchases:number; sales:number;}
export function monthly(movements:Movement[]): MonthRow[] {
  const index=new Map<string,MonthRow>();
  for(const m of movements) {
    const key=monthKey(m.date);
    if(!/^\d{4}-\d{2}$/.test(key)) continue;
    if(!index.has(key)) index.set(key,{month:key,income:0,expense:0,net:0,fairIncome:0,fairExpense:0,fairResult:0,purchases:0,sales:0});
    const r=index.get(key)!;
    if(m.kind==='income') {r.income+=m.amount??0;if(m.source==='Feira')r.fairIncome+=m.amount??0;}
    if(m.kind==='expense') {r.expense+=m.amount??0;if(m.purpose==='Feira')r.fairExpense+=m.amount??0;}
    if(m.kind==='buy')r.purchases+=operationGross(m)+(m.fees??0);
    if(m.kind==='sell')r.sales+=operationGross(m)-(m.fees??0);
  }
  return [...index.values()].sort((a,b)=>a.month.localeCompare(b.month)).map(r=>({...r,net:round(r.income-r.expense),fairResult:round(r.fairIncome-r.fairExpense)}));
}
export function allocation(data:FinanceData) {
  const pos=positions(data.assets,data.movements,data.quotes);
  const balances=accountBalances(data.accounts,data.movements);
  const sums=new Map<string,number>();
  for(const p of pos) sums.set(p.asset.purpose,(sums.get(p.asset.purpose)??0)+p.marketValue);
  for(const a of balances) sums.set(a.purpose,(sums.get(a.purpose)??0)+a.balance);
  return [...sums.entries()].map(([name,value])=>({name,value:round(value)})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
}
export interface Projection {year:number; invested:number; conservative:number; base:number; optimistic:number;}
export function project(initial:number,monthlyContribution:number,years:number,rates:[number,number,number]):Projection[] {
  const out:Projection[]=[];
  let values=[initial,initial,initial];
  const monthlyRates=rates.map(r=>Math.pow(1+Math.max(-0.99,r),1/12)-1);
  for(let year=0;year<=years;year++) {
    if(year>0) for(let month=0;month<12;month++) values=values.map((v,i)=>v*(1+monthlyRates[i])+monthlyContribution);
    out.push({year,invested:round(initial+year*12*monthlyContribution),conservative:round(values[0]),base:round(values[1]),optimistic:round(values[2])});
  }
  return out;
}
export function netWorth(data:FinanceData) {
  return round(accountBalances(data.accounts,data.movements).reduce((s,a)=>s+a.balance,0)+positions(data.assets,data.movements,data.quotes).reduce((s,p)=>s+p.marketValue,0));
}
export function validateMovement(m:Movement, data:FinanceData): string|null {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(m.date)||Number.isNaN(Date.parse(m.date+'T12:00:00')))return 'Informe uma data válida.';
  if(!m.description?.trim())return 'Informe uma descrição.';
  if(m.kind!=='openingPosition'&&!data.accounts.some(a=>a.id===m.accountId))return 'Selecione uma conta válida.';
  if(m.kind==='transfer') {
    if(!data.accounts.some(a=>a.id===m.toAccountId)||m.toAccountId===m.accountId)return 'Escolha outra conta de destino.';
  }
  if(['buy','sell','openingPosition'].includes(m.kind)) {
    if(!data.assets.some(a=>a.id===m.assetId))return 'Selecione um ativo cadastrado.';
    if(!(Number.isFinite(m.quantity)&&m.quantity! > 0)||!(Number.isFinite(m.unitPrice)&&m.unitPrice! >= 0)||!(Number.isFinite(m.fxRate)&&m.fxRate! > 0))return 'Quantidade, preço e câmbio precisam ser válidos.';
    if(m.kind==='sell') {
      const available=positions(data.assets,data.movements.filter(x=>x.id!==m.id&&x.date<=m.date),data.quotes).find(p=>p.asset.id===m.assetId)?.units??0;
      if(m.quantity! > available+1e-8)return `Saldo insuficiente: ${number(available,8)} unidades disponíveis nesta data.`;
    }
  } else if(!(Number.isFinite(m.amount)&&m.amount!>=0)) return 'Informe um valor não negativo.';
  if((m.fees??0)<0)return 'Taxas não podem ser negativas.';
  return null;
}
