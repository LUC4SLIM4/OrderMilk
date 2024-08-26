import React from 'react';

const isAuthenticated = (username: string, password: string): boolean => {
  if (username === 'teste' && password === 'teste') {
    return true;
  } else {
    return false;
  }
};

export { isAuthenticated };
