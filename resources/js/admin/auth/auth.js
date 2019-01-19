/*jshint esversion: 6 */
// check the login credential
export function login(path, credential) {
  return new Promise((res, rej) => {
    axios.post(path, credential)
      .then(response => {
        res(response.data)
      })
      .catch(err => {
        rej(err)
      })
  });
}

// get current user form local storage
export function getCurrentUser() {
  let userStr = localStorage.getItem('user');

  if(!userStr) return null;
  
  return JSON.parse(userStr);
}
