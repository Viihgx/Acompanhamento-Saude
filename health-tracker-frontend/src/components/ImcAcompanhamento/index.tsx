import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "../../services/api";
import CustomCalendarAcompanhamento from "../Calendar/CalendarAcompanhamento";
import "./ImcAcompanhamento.css";

export default function ImcAcompanhamento() {
  const [showForm, setShowForm] = useState(true); // Controla se o formulário será exibido
  const [disableMessage, setDisableMessage] = useState(""); // Mensagem para informar sobre a espera
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      peso: "",
      altura: "",
      exercicios: "0",
      alimentacao: "moderada",
      obstaculos: "nenhum",
      objetivos: "frequencia",
      alcance: "nada",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Você precisa estar logado.");
          return;
        }
  
        // Obter dados do usuário
        const userResponse = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (userResponse.status === 200 && userResponse.data.height) {
          setValue("altura", userResponse.data.height.toFixed(2));
        }
  
        // Obter a última data de progresso do usuário
        const progressResponse = await api.get("/last-progress-date", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (progressResponse.status === 200) {
          const { lastProgressDate, isFirstEntry } = progressResponse.data;
  
          // Caso seja o primeiro registro
          if (isFirstEntry) {
            setShowForm(true);
            return;
          }
  
          if (!lastProgressDate) {
            setShowForm(true);
            return;
          }
  
          const lastDate = new Date(lastProgressDate);
          const currentDate = new Date();
          const diffInDays = Math.floor(
            (currentDate.setHours(0, 0, 0, 0) - lastDate.setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
          );
  
          if (diffInDays < 7) {
            setShowForm(false);
            setDisableMessage(
              `Você só pode preencher o acompanhamento novamente em ${7 - diffInDays} dia(s).`
            );
          } else {
            setShowForm(true);
          }
        } else {
          console.error("Erro ao buscar a última data de progresso.");
        }
      } catch (err) {
        console.error("Erro ao carregar os dados:", err);
      }
    };
  
    fetchUserData();
  }, [setValue]);
  
  
  

  const validatePeso = (value: string) => {
    if (!/^\d{1,4}(\.\d{1})?$/.test(value)) {
      return "Preencha esse campo corretamente.";
    }
    const pesoValue = parseFloat(value);
    if (!pesoValue) return "O campo de peso é obrigatório.";
    if (pesoValue > 600) return "O peso máximo permitido é 600 kg.";
    return true;
  };

  const validateAltura = (value: string) => {
    if (!/^[0-2](\.\d{1,2})?$/.test(value)) {
      return "A altura máxima permitida é 2.50 metros!";
    }
    const alturaValue = parseFloat(value);
    if (!alturaValue) return "O campo de altura é obrigatório.";
    if (alturaValue > 2.5) return "A altura máxima permitida é 2.50 metros!";
    return true;
  };

  const onSubmit = async (data: any) => {
    const {
      peso,
      altura,
      exercicios,
      alimentacao,
      obstaculos,
      objetivos,
      alcance,
    } = data;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para realizar o check-in.");
        return;
      }

      const pesoValue = parseFloat(peso);
      const alturaValue = parseFloat(altura);

      const imc = (pesoValue / alturaValue ** 2).toFixed(2);

      const response = await api.post(
        "/progress",
        {
          weight: pesoValue,
          height: alturaValue,
          imc,
          dias_exercicio: exercicios,
          qualidade_alimentacao: alimentacao,
          obstaculos,
          objetivos,
          alvo_alcancado: alcance,
          date: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert("Check-in salvo com sucesso!");
        setValue("peso", "");
        setValue("altura", alturaValue.toFixed(2));
        setValue("exercicios", "0");
        setValue("alimentacao", "moderada");
        setValue("obstaculos", "nenhum");
        setValue("objetivos", "frequencia");
        setValue("alcance", "nada");
      } else {
        alert("Erro ao salvar o check-in.");
      }
    } catch (err) {
      console.error("Erro ao salvar check-in:", err);
      alert("Erro ao salvar o check-in.");
    }
  };

  return (
    <div className="imc-acompanhamento-fullscreen">
      {showForm ? (
        <div className="formulario-container">
          <h1>Acompanhamento Semanal</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="peso">Peso (kg) atual:</label>
              <Controller
                name="peso"
                control={control}
                rules={{
                  validate: validatePeso,
                }}
                render={({ field }) => (
                  <input
                    type="text"
                    id="peso"
                    {...field}
                    placeholder="Digite seu peso em kg (ex: 75.5)"
                    className={errors.peso ? "input-error" : ""}
                    maxLength={6}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^\d]/g, ""); // Apenas números
                      if (value.length > 3) {
                        value = `${value.slice(0, 3)}.${value.slice(3, 4)}`; // Ponto após o terceiro dígito
                      } else if (value.length > 2) {
                        value = `${value.slice(0, 2)}.${value.slice(2, 3)}`; // Ponto após o segundo dígito
                      }
                      e.target.value = value;
                      field.onChange(e);
                    }}
                  />
                )}
              />
              {errors.peso && (
                <span className="error-message">{errors.peso.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="altura">Altura (m) atual:</label>
              <Controller
                name="altura"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) return "O campo de altura é obrigatório.";
                    return validateAltura(value); // Aplica a validação existente para valores inválidos
                  },
                }}
                render={({ field }) => (
                  <input
                    type="text"
                    id="altura"
                    {...field}
                    placeholder="Digite sua altura em metros (ex: 1.75)"
                    className={errors.altura ? "input-error" : ""}
                    maxLength={4}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^\d]/g, ""); // Apenas números
                      if (value.length > 1) {
                        value = `${value.slice(0, 1)}.${value.slice(1, 3)}`; // Adiciona ponto após o primeiro dígito
                      }
                      e.target.value = value;
                      field.onChange(e);
                    }}
                  />
                )}
              />
              {errors.altura && (
                <span className="error-message">{errors.altura.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exercicios">
                Dias de exercícios físicos nesta semana:
              </label>
              <Controller
                name="exercicios"
                control={control}
                render={({ field }) => (
                  <select id="exercicios" {...field}>
                    <option value="0">Não pratiquei</option>
                    <option value="1">1 a 2 dias</option>
                    <option value="3">3 a 4 dias</option>
                    <option value="5">5 ou mais dias</option>
                  </select>
                )}
              />
            </div>

            <div className="form-group">
              <label htmlFor="alimentacao">
                Classificação da alimentação nesta semana:
              </label>
              <Controller
                name="alimentacao"
                control={control}
                render={({ field }) => (
                  <select id="alimentacao" {...field}>
                    <option value="muito-saudavel">Muito Saudável</option>
                    <option value="saudavel">Saudável</option>
                    <option value="moderada">Moderada</option>
                    <option value="pouco-saudavel">Pouco Saudável</option>
                    <option value="muito-ruim">Muito Ruim</option>
                  </select>
                )}
              />
            </div>

            <div className="form-group">
              <label htmlFor="obstaculos">
                Obstáculos enfrentados nesta semana:
              </label>
              <Controller
                name="obstaculos"
                control={control}
                render={({ field }) => (
                  <select id="obstaculos" {...field}>
                    <option value="tempo">Falta de tempo</option>
                    <option value="disposicao">Falta de disposição</option>
                    <option value="renda">Falta de renda</option>
                    <option value="disponibilidade">
                      Falta de disponibilidade
                    </option>
                    <option value="nenhum">Não enfrentei obstáculos</option>
                  </select>
                )}
              />
            </div>

            <div className="form-group">
              <label htmlFor="objetivos">
                Objetivos para a próxima semana:
              </label>
              <Controller
                name="objetivos"
                control={control}
                render={({ field }) => (
                  <select id="objetivos" {...field}>
                    <option value="frequencia">
                      Aumentar a frequência de exercícios
                    </option>
                    <option value="alimentacao">
                      Melhorar a qualidade da alimentação
                    </option>
                    <option value="reduzir-alimentos">
                      Reduzir o consumo de alimentos não saudáveis
                    </option>
                  </select>
                )}
              />
            </div>

            <div className="form-group">
              <label htmlFor="alcance">
                Alcance do objetivo em relação à semana anterior:
              </label>
              <Controller
                name="alcance"
                control={control}
                render={({ field }) => (
                  <select id="alcance" {...field}>
                    <option value="completamente">Completamente</option>
                    <option value="parcialmente">Parcialmente</option>
                    <option value="pouco">Pouco</option>
                    <option value="nada">Nada</option>
                  </select>
                )}
              />
            </div>

            <button className="button-submit-form" type="submit">Enviar</button>
          </form>
        </div>
      ) : (
        <div className="mensagem-container">
          <div className="mensagem-box">
            <div className="icon-container">⏳</div>
            <p>
            <strong>{disableMessage}</strong>.
            </p>
          </div>
        </div>

      
      )}
      <div className="informacoes-container">
        <div className="content-info">
          <h2>Acompanhe o seu check-in semanal</h2>
          <div className="calendar-container">
            <CustomCalendarAcompanhamento />
          </div>
        </div>
      </div>
    </div>
  );
}
