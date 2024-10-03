import { showMessage } from "react-native-flash-message";

const useValidation = (credenciais) => {
    const validateFields = () => {
        const { name, email, propertyName, propertySize, lactatingAnimals, password, confirmpassword } = credenciais;

        if (!credenciais) {
            showMessage({ message: 'Por favor, preencha todos os campos.', type: "danger" });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage({ message: 'Por favor, insira um e-mail válido.', type: "danger" });
            return false;
        }

        if (password.length < 6) {
            showMessage({ message: 'A senha deve ter pelo menos 6 caracteres.', type: "danger" });
            return false;
        }

        if (password !== confirmpassword) {
            showMessage({ message: 'As senhas não coincidem.', type: "danger" });
            return false;
        }

        return true;
    };

    return { validateFields };
};

export default useValidation;
