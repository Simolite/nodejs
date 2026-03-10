export function sum(a,b){
    return Number(a)+Number(b);
}
export function sub(a,b){
    return Number(a)-Number(b);
}
export function mult(a,b){
    return Number(a)*Number(b);
}
export function div(a,b){
    if(b==0){return `division par 0 imposible`}
    return Number(a)/Number(b);
}