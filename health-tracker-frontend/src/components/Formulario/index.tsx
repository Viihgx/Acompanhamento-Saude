import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "../../services/api";
import { FormData } from "../../types/user";

export default function Formulario() {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await api.post("/login", { email: data.email });
      const { token } = response.data;
  
      // Salvar o token
      localStorage.setItem("token", token);
  
      alert("Login bem-sucedido!");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Acompanhamento Semanal</h2>
      <div>
        <label>Nome:</label>
        <input {...register("name", { required: true })} />
      </div>
      <div>
        <label>E-mail:</label>
        <input type="email" {...register("email", { required: true })} />
      </div>
      <div>
        <label>Peso (kg):</label>
        <input type="number" {...register("weight", { required: true })} step="0.1" />
      </div>
      <div>
        <label>Altura (m):</label>
        <input type="number" {...register("height", { required: true })} step="0.01" />
      </div>
        <div>
        <label>Senha:</label>
        <input type="password" {...register("password", { required: true })} />
      </div>
      <div>
        <label>Deseja receber e-mails semanais?</label>
        <input type="checkbox" {...register("receiveEmails")} />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

