import SaApplication from "../../sa-token/application/SaApplication.js";

const sa = new SaApplication();
sa.set('testKey', 'testValue');
sa.set('testKey1', 'testValue1');
sa.set('testKey2', 'testValue2');
// sa.delete('testKey');
// const sa2 = new SaApplication();
// console.log(await sa.set('testKey', 'testValue'));
console.log(await sa.get('testKey')); 
sa.keys().then(keys => {
    console.log("Current keys:", keys);
});

sa.delete('testKey');

console.log(await sa.get('testKey')); 

console.log(await sa.has('testKey1')); 
console.log( await sa.has('testKey5')); 

await sa.clear();

sa.keys().then(keys => {
    console.log("Current keys:", keys);
});

