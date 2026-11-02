import type {Account,FinanceData} from './types.ts';
export type OnboardingStep='account'|'opening'|'income'|'complete';
export function onboardingStep(data:FinanceData,skipOpening:boolean):OnboardingStep {
  if(data.accounts.length===0)return 'account';
  const hasIncome=data.movements.some(m=>m.kind==='income');
  if(!hasIncome&&!skipOpening&&!data.movements.some(m=>m.kind==='openingBalance'))return 'opening';
  return hasIncome?'complete':'income';
}
export function accountNameError(name:string,existing:Account[],excludeId?:string):string|null {
  const clean=name.trim();
  if(!clean)return 'Informe o nome da conta.';
  if(existing.some(a=>a.id!==excludeId&&a.name.trim().toLocaleLowerCase('pt-BR')===clean.toLocaleLowerCase('pt-BR')))
    return 'Já existe uma conta com este nome.';
  return null;
}
