import assert from 'node:assert/strict';
import test from 'node:test';
import {cashDelta, positions, monthly, project, validateMovement, accountBalances} from './finance.ts';
import type {Asset,Account,Movement,FinanceData} from './types.ts';
const a: Account={id:'bank',name:'Banco',purpose:'Despesas pessoais',type:'Banco'};
const b:Account={id:'fair',name:'Feira',purpose:'Feira',type:'Caixa'};
const asset:Asset={id:'selic',ticker:'TES-S',name:'Tesouro Selic',class:'Tesouro Selic',purpose:'Emergência',currency:'BRL'};
const movement=(id:string,kind:Movement['kind'],date='2026-01-10',other:Partial<Movement>={}):Movement=>({id,kind,date,accountId:'bank',amount:0,description:'Teste',...other});
test('transferência não gera receita/despesa e afeta os dois saldos',()=>{
 const tr=movement('t','transfer','2026-01-10',{amount:200,toAccountId:'fair'});
 assert.equal(cashDelta(tr,'bank'),-200);assert.equal(cashDelta(tr,'fair'),200);
 assert.deepEqual(accountBalances([a,b],[movement('o','openingBalance','2026-01-01',{amount:500}),tr]).map(x=>x.balance),[300,200]);
 const rows=monthly([tr]);assert.equal(rows[0].income,0);assert.equal(rows[0].expense,0);
});
test('compra não é despesa; preço médio, venda e ganho realizado',()=>{
 const movements=[movement('b1','buy','2026-01-02',{assetId:'selic',quantity:2,unitPrice:100,fxRate:1,fees:2}),movement('b2','buy','2026-02-02',{assetId:'selic',quantity:1,unitPrice:130,fxRate:1}),movement('s1','sell','2026-03-02',{assetId:'selic',quantity:1,unitPrice:160,fxRate:1,fees:1})];
 const p=positions([asset],movements,[])[0]; assert.equal(p.units,2);assert.equal(p.avgCost,110.66666667);assert.equal(p.cost,221.33333333);assert.equal(p.realized,48.33333333);
 const rows=monthly(movements); assert.equal(rows.reduce((s,r)=>s+r.expense,0),0); assert.equal(rows.reduce((s,r)=>s+r.purchases,0),332);
});
test('cotação em USD convertida para BRL',()=>{
 const usd={...asset,currency:'USD' as const};const p=positions([usd],[movement('i','openingPosition','2026-01-02',{assetId:'selic',quantity:2,unitPrice:10,fxRate:5})],[{id:'q',date:'2026-02-01',assetId:'selic',price:12,currency:'USD',fxRate:5.2,source:'manual'}])[0];assert.equal(p.marketValue,124.8);assert.equal(p.unrealized,24.8);
});
test('projeção taxa zero = capital + aportes',()=>{
 const p=project(1000,100,2,[0,0,0]);assert.equal(p[2].base,3400);assert.equal(p[2].invested,3400);
});
test('venda não permite quantidade acima da posição',()=>{
 const m=movement('s','sell','2026-03-01',{assetId:'selic',quantity:2,unitPrice:100,fxRate:1});const data:FinanceData={accounts:[a],assets:[asset],movements:[movement('b','buy','2026-02-01',{assetId:'selic',quantity:1,unitPrice:90,fxRate:1})],quotes:[],goals:[]};assert.match(validateMovement(m,data)??'',/insuficiente/);
});
