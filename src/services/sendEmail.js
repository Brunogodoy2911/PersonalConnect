import axios from 'axios';

const sendEmail = async (email, password) => {
  console.log(password)
  try {
    console.log(password)
    const response = await axios.post('https://backendtcc-production.up.railway.app/send-email', {
      to: email,
      subject: `Olá! Sua senha gerada é: ${password}`,
    });

    console.log('Resposta do servidor:', response.data);
    alert('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.response?.data || error.message);
    alert('Erro ao enviar o e-mail. Tente novamente.');
  }
};

export default sendEmail;
