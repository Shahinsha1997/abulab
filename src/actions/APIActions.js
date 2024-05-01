const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbwJveukVFNrfLLZaJ4FlTEm7yIVIHMK_0Vw2hUirjoOWsUJs2tr6K0SCHki-ibZ-M7E/exec'
export const authenticate = (userName, password) =>{
    return new Promise((resolve, reject)=>{
        return fetch(AUTHENTICATE_URL, {
            redirect: "follow",
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name:userName, password}), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(data=>resolve(data))
        .catch(err=>reject(err))
    })
        
    
}