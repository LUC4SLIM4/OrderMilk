import { useState } from 'react';

const useForm = (initialState) => {
  const [formState, setFormState] = useState(initialState);
  
  const handleChange = (field, value) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  };

  const resetForm = () => setFormState(initialState);

  return [formState, handleChange, resetForm];
};

export default useForm;
