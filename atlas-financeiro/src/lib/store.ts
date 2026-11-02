import {collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch, type Unsubscribe} from 'firebase/firestore';
import {db} from './firebase.ts';
import type {FinanceData, Account,Asset,Movement,Quote,Goal} from '../domain/types.ts';
type CollectionName=keyof FinanceData;
const tables:CollectionName[]=['accounts','assets','movements','quotes','goals'];
const path=(uid:string,table:CollectionName)=>{if(!db)throw Error('Firebase não configurado.');return collection(db,'users',uid,table);};
export function subscribeFinance(uid:string,onChange:(table:CollectionName,rows:FinanceData[CollectionName])=>void,onError:(message:string)=>void):Unsubscribe {
  const subscriptions=tables.map(table=>onSnapshot(path(uid,table),snap=>{
    onChange(table,snap.docs.map(d=>d.data()) as FinanceData[CollectionName]);
  },e=>onError(`Erro Firestore (${table}): ${e.message}`)));
  return ()=>subscriptions.forEach(unsubscribe=>unsubscribe());
}
export async function saveEntity(uid:string,table:'accounts',value:Account):Promise<void>;
export async function saveEntity(uid:string,table:'assets',value:Asset):Promise<void>;
export async function saveEntity(uid:string,table:'movements',value:Movement):Promise<void>;
export async function saveEntity(uid:string,table:'quotes',value:Quote):Promise<void>;
export async function saveEntity(uid:string,table:'goals',value:Goal):Promise<void>;
export async function saveEntity(uid:string,table:CollectionName,value:Account|Asset|Movement|Quote|Goal):Promise<void> {
  if(!db)throw Error('Firebase não configurado.');
  await setDoc(doc(path(uid,table),value.id),JSON.parse(JSON.stringify(value)));
}
export async function removeEntity(uid:string,table:CollectionName,id:string){if(!db)throw Error('Firebase não configurado.');await deleteDoc(doc(path(uid,table),id));}
export async function seedDemo(uid:string,data:FinanceData) {
 if(!db)throw Error('Firebase não configurado.');
 // Firestore aceita até 500 writes por batch. Amostras aqui são menores que 250 docs.
 const entries=tables.flatMap(table=>data[table].map(row=>({table,row})));
 if(entries.length>400)throw Error('Demonstração excede tamanho permitido do lote.');
 const batch=writeBatch(db);
 for(const {table,row} of entries) batch.set(doc(path(uid,table),row.id),JSON.parse(JSON.stringify(row)));
 await batch.commit();
}
