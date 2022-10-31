
const paises = async () =>{

    const response = await fetch('https://restcountries.com/v3.1/region/europe');
    
    if(response.status !=200)
    throw new Error('Nao e possivel ler os dados');
    
    const data = await response.json();
    
    return data;
 };





    export default paises;
    