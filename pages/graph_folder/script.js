let params = (new URL(document.location)).searchParams;
let token = params.get("token");
const get_author_ids = async (id,req_token) => {
    const response = await fetch('https://umd-spotify-backend.herokuapp.com/get_authorlist?', {
      method: 'GET',
      body: JSON.stringify({
        term: req_term,
        token: req_token
      }), 
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response; 
  }
  
console.log(get_author_ids('short_term',token))