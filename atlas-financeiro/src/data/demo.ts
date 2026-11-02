import type {Account, Asset, FinanceData, Movement, Quote, Goal} from '../domain/types.ts';
export const DEMO_LABEL='DADOS FICTÍCIOS — SEM VALOR REAL';
const accounts:Account[]=[
 {id:'bank',name:'Banco salário',purpose:'Despesas pessoais',type:'Conta corrente'},
 {id:'fair',name:'Caixa da Feira',purpose:'Feira',type:'Conta operacional'},
 {id:'broker',name:'Corretora BRL',purpose:'Oportunidades',type:'Conta investimentos'},
 {id:'reserve',name:'Reserva corrente',purpose:'Emergência',type:'Conta líquida'},
 {id:'exchange',name:'Exchange BRL',purpose:'Oportunidades',type:'Cripto'}
];
const assets:Asset[]=[
 {id:'selic',ticker:'TES-SELIC-2029',name:'Tesouro Selic 2029',class:'Tesouro Selic',purpose:'Emergência',currency:'BRL',issuer:'Tesouro Nacional',maturity:'2029-03-01'},
 {id:'ipca',ticker:'TES-IPCA-2035',name:'Tesouro IPCA+ 2035',class:'Tesouro IPCA+',purpose:'Aposentadoria',currency:'BRL',issuer:'Tesouro Nacional',maturity:'2035-05-15'},
 {id:'bbas',ticker:'BBAS3',name:'Banco do Brasil ON',class:'Ações BR',purpose:'Aposentadoria',currency:'BRL'},
 {id:'itub',ticker:'ITUB4',name:'Itaú Unibanco PN',class:'Ações BR',purpose:'Aposentadoria',currency:'BRL'},
 {id:'taee',ticker:'TAEE11',name:'Taesa Units',class:'Ações BR',purpose:'Aposentadoria',currency:'BRL'},
 {id:'fii',ticker:'HGLG11',name:'FII Logística (exemplo)',class:'FII',purpose:'Aposentadoria',currency:'BRL'},
 {id:'etf',ticker:'IVVB11',name:'ETF S&P 500 BR (exemplo)',class:'ETF BR',purpose:'Oportunidades',currency:'BRL'},
 {id:'btc',ticker:'BTC',name:'Bitcoin',class:'Cripto',purpose:'Oportunidades',currency:'USD'},
 {id:'usd',ticker:'USD',name:'Dólar',class:'Moeda estrangeira',purpose:'Oportunidades',currency:'USD'}
];
const quotes:Quote[]=[
 {id:'q-selic',assetId:'selic',date:'2026-10-30',price:15369.75,currency:'BRL',fxRate:1,marketRate:0.128,source:'COTAÇÃO FICTÍCIA'},
 {id:'q-ipca',assetId:'ipca',date:'2026-10-30',price:3519,currency:'BRL',fxRate:1,marketRate:0.062,source:'COTAÇÃO FICTÍCIA'},
 {id:'q-bbas',assetId:'bbas',date:'2026-10-30',price:24.9,currency:'BRL',fxRate:1,source:'COTAÇÃO FICTÍCIA'},
 {id:'q-itub',assetId:'itub',date:'2026-10-30',price:43.7,currency:'BRL',fxRate:1,source:'COTAÇÃO FICTÍCIA'},
 {id:'q-taee',assetId:'taee',date:'2026-10-30',price:36.8,currency:'BRL',fxRate:1,source:'COTAÇÃO FICTÍCIA'},
 {id:'q-fii',assetId:'fii',date:'2026-10-30',price:158.6,currency:'BRL',fxRate:1,source:'COTAÇÃO FICTÍCIA'},
 {id:'q-etf',assetId:'etf',date:'2026-10-30',price:360,currency:'BRL',fxRate:1,source:'COTAÇÃO FICTÍCIA'},
 {id:'q-btc',assetId:'btc',date:'2026-10-30',price:68000,currency:'USD',fxRate:5.1,source:'COTAÇÃO FICTÍCIA'},
 {id:'q-usd',assetId:'usd',date:'2026-10-30',price:1,currency:'USD',fxRate:5.1,source:'COTAÇÃO FICTÍCIA'}
];
const goals:Goal[]=[
 {id:'g-reserva',name:'Reserva de emergência',purpose:'Emergência',target:30000,deadline:'2027-12-31'},
 {id:'g-apos',name:'Aposentadoria',purpose:'Aposentadoria',target:1000000,deadline:'2046-12-31'},
 {id:'g-feira',name:'Capital de giro da feira',purpose:'Feira',target:20000,deadline:'2027-06-30'}
];
const movements:Movement[]=[];
function add(m:Omit<Movement,'id'|'demo'>){movements.push({id:`demo-${String(movements.length+1).padStart(4,'0')}`,...m,demo:true});}
add({date:'2026-01-01',kind:'openingBalance',accountId:'bank',amount:7000,description:'Saldo inicial fictício — banco'});
add({date:'2026-01-01',kind:'openingBalance',accountId:'fair',amount:2400,description:'Giro inicial fictício da feira',purpose:'Feira'});
add({date:'2026-01-01',kind:'openingBalance',accountId:'broker',amount:12000,description:'Saldo inicial fictício — corretora'});
add({date:'2026-01-01',kind:'openingBalance',accountId:'reserve',amount:5000,description:'Saldo inicial fictício — emergência'});
add({date:'2026-01-01',kind:'openingBalance',accountId:'exchange',amount:3000,description:'Saldo inicial fictício — exchange'});
add({date:'2026-01-01',kind:'openingPosition',assetId:'bbas',quantity:6,unitPrice:21.54,fxRate:1,amount:129.24,description:'Posição inicial fictícia BBAS3',purpose:'Aposentadoria'});
add({date:'2026-01-01',kind:'openingPosition',assetId:'itub',quantity:3,unitPrice:39,fxRate:1,amount:117,description:'Posição inicial fictícia ITUB4',purpose:'Aposentadoria'});
add({date:'2026-01-01',kind:'openingPosition',assetId:'taee',quantity:9,unitPrice:33,fxRate:1,amount:297,description:'Posição inicial fictícia TAEE11',purpose:'Aposentadoria'});
for(let m=1;m<=10;m++){
 const mm=String(m).padStart(2,'0'),month=`2026-${mm}`;
 add({date:`${month}-05`,kind:'income',accountId:'bank',amount:6500,source:'Servidor público',category:'Salário',description:'Salário — servidor público',purpose:'Despesas pessoais'});
 add({date:`${month}-07`,kind:'expense',accountId:'bank',amount:1350+25*m,category:'Moradia',description:'Moradia e contas',purpose:'Despesas pessoais'});
 add({date:`${month}-09`,kind:'expense',accountId:'bank',amount:950+10*m,category:'Alimentação',description:'Supermercado',purpose:'Despesas pessoais'});
 add({date:`${month}-12`,kind:'expense',accountId:'bank',amount:390+8*m,category:'Transporte',description:'Combustível e mobilidade',purpose:'Despesas pessoais'});
 add({date:`${month}-14`,kind:'expense',accountId:'bank',amount:230,category:'Saúde',description:'Saúde e bem-estar',purpose:'Despesas pessoais'});
 for(let w=0;w<4;w++){
  const day=String(4+w*7).padStart(2,'0');
  add({date:`${month}-${day}`,kind:'income',accountId:'fair',amount:830+(m%3)*40+w*25,source:'Feira',category:'Venda na feira',description:'Venda no ponto da feira',purpose:'Feira'});
  add({date:`${month}-${day}`,kind:'expense',accountId:'fair',amount:425+w*14,category:'Mercadoria',description:'Reposição de produtos para a feira',purpose:'Feira'});
 }
 add({date:`${month}-18`,kind:'transfer',accountId:'fair',toAccountId:'bank',amount:650,description:'Retirada de lucro da feira (não é nova receita)',purpose:'Feira'});
 if(m%2===0)add({date:`${month}-19`,kind:'income',accountId:'bank',amount:900+m*30,source:'Serviços de TI',category:'Serviço profissional',description:'Projeto autônomo — TI',purpose:'Despesas pessoais'});
 add({date:`${month}-20`,kind:'transfer',accountId:'bank',toAccountId:'broker',amount:1200,description:'Aporte para investimentos (não é despesa)',purpose:'Aposentadoria',contributionDate:`${month}-20`});
 if(m%2===1){add({date:`${month}-21`,kind:'buy',accountId:'broker',assetId:'ipca',quantity:0.04,unitPrice:3350+m*18,fxRate:1,fees:0,purchaseRate:0.065+(10-m)*0.001,description:'Compra Tesouro IPCA+ com taxa de aquisição',purpose:'Aposentadoria',contributionDate:`${month}-20`});}
 else add({date:`${month}-21`,kind:'buy',accountId:'broker',assetId:'selic',quantity:0.02,unitPrice:14200+m*95,fxRate:1,fees:0,description:'Compra Tesouro Selic',purpose:'Emergência',contributionDate:`${month}-20`});
 if(m%3===0) add({date:`${month}-22`,kind:'buy',accountId:'broker',assetId:'fii',quantity:2,unitPrice:151+m,fxRate:1,fees:0,description:'Aporte FII logístico',purpose:'Aposentadoria'});
 if(m%3===1) add({date:`${month}-23`,kind:'buy',accountId:'broker',assetId:'bbas',quantity:4,unitPrice:23+m*0.1,fxRate:1,fees:0,description:'Compra de ação pagadora de dividendos',purpose:'Aposentadoria'});
 if(m%2===0)add({date:`${month}-25`,kind:'income',accountId:'broker',amount:39+m,source:'Dividendos/Juros',category:'Dividendos',description:'Dividendos/aluguéis fictícios',purpose:'Aposentadoria'});
}
add({date:'2026-02-12',kind:'buy',accountId:'exchange',assetId:'btc',quantity:0.003,unitPrice:64000,fxRate:5,fees:6,description:'Bitcoin em USD — cotação e câmbio na data',purpose:'Oportunidades'});
add({date:'2026-04-03',kind:'buy',accountId:'broker',assetId:'etf',quantity:3,unitPrice:325,fxRate:1,fees:2,description:'ETF internacional negociado em BRL',purpose:'Oportunidades'});
add({date:'2026-06-20',kind:'buy',accountId:'exchange',assetId:'btc',quantity:0.002,unitPrice:61500,fxRate:5.2,fees:5,description:'Segundo lote de Bitcoin',purpose:'Oportunidades'});
add({date:'2026-08-08',kind:'buy',accountId:'broker',assetId:'usd',quantity:100,unitPrice:1,fxRate:5.05,fees:0,description:'Compra fictícia USD',purpose:'Oportunidades'});
export const demoData:FinanceData={accounts,assets,movements,quotes,goals};
