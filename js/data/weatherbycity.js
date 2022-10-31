

const city = async (q) =>{
   //insert key from API
      const key='30669941dfec4df2a5f175051222610'

    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${q}&days=4&aqi=no&alerts=no`);
    
    if(response.status !=200)
    throw new Error('Nao e possivel ler os dados');
    
    const data = await response.json();
    
    return data;
 };


    export default city;