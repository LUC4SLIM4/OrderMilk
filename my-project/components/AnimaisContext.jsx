// AnimaisContext.js
import React, { createContext, useState } from 'react';

const AnimaisContext = createContext();

const AnimaisProvider = ({ children }) => {
  const [animais, setAnimais] = useState([]);

  const adicionarAnimal = (animal) => {
    setAnimais([...animais, animal]);
  };

  return (
    <AnimaisContext.Provider value={{ animais, adicionarAnimal }}>
      {children}
    </AnimaisContext.Provider>
  );
};

export { AnimaisProvider, AnimaisContext };