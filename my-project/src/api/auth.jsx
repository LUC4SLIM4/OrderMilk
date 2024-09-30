const isAuthenticated = (username, password) => {
    if (username === 'teste' && password === 'teste') {
      return true;
    } else {
      return false;
    }
  };
  
  export { isAuthenticated };
  