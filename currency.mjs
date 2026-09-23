export function clearReward(spec){if(spec.kind==='shop')return 0;return (spec.kind==='boss'?50:spec.kind==='elite'?20:10)*spec.chapter;}
export class PizzaWallet{
 constructor(storage){this.storage=storage;this.balance=0;this.receipts=[];try{const v=JSON.parse(storage.getItem('penny-wallet-v1')||'null');if(Number.isSafeInteger(v?.balance)&&v.balance>=0){this.balance=v.balance;this.receipts=Array.isArray(v.receipts)?v.receipts.filter(x=>typeof x==='string'):[];}}catch{}}
 credit(id,amount){if(typeof id!=='string'||!Number.isSafeInteger(amount)||amount<=0||this.receipts.includes(id))return {added:0,saved:true};if(!Number.isSafeInteger(this.balance+amount))return {added:0,saved:false};this.balance+=amount;this.receipts.push(id);let saved=true;try{this.storage.setItem('penny-wallet-v1',JSON.stringify({balance:this.balance,receipts:this.receipts}));}catch{saved=false;}return {added:amount,saved};}
}
