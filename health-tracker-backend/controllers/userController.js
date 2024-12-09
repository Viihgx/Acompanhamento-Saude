const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../supabaseClient");

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    weight,
    height,
    receiveEmails,
    exercicios,
    alimentacao,
    obstaculos,
    objetivos,
    alcance,
  } = req.body;

  if (!receiveEmails) {
    return res
      .status(400)
      .json({ error: "Voc├¬ deve aceitar receber e-mails semanais para se registrar." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o usu├írio na tabela `users`
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          weight,
          height,
          receive_emails: receiveEmails,
        },
      ])
      .select("*")
      .single();

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    // Calcular o IMC inicial
    const imc = parseFloat(weight) / (parseFloat(height) * parseFloat(height));

    // Salvar o progresso inicial na tabela `progress`
    const { error: progressError } = await supabase.from("progress").insert([
      {
        user_id: userData.id,
        date: new Date().toISOString(),
        imc: imc.toFixed(2),
        weight,
        dias_exercicio: parseInt(exercicios, 10),
        qualidade_alimentacao: alimentacao,
        obstaculos,
        objetivos,
        alvo_alcancado: alcance,
      },
    ]);

    if (progressError) {
      return res.status(500).json({ error: progressError.message });
    }

    res.status(201).json({ message: "Usu├írio registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usu├írio." });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, password")
      .eq("email", email)
      .single();

    if (error || !data) return res.status(404).json({ error: "Usu├írio n├úo encontrado!" });

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Credenciais inv├ílidas!" });

    const token = jwt.sign({ id: data.id, name: data.name, email: data.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select("name, weight, height")
      .eq("id", userId)
      .single();

    if (error || !data) return res.status(404).json({ error: "Usu├írio n├úo encontrado!" });

    const imc = data.weight / (data.height * data.height);
    const tips = imc < 18.5 ? "Aumente sua ingest├úo cal├│rica!" : imc > 24.9 ? "Reduza carboidratos e fa├ºa exerc├¡cios!" : "Continue mantendo sua dieta equilibrada!";

    res.status(200).json({ name: data.name, imc: imc.toFixed(2), tips });
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar o dashboard." });
  }
};

const saveProgress = async (req, res) => {
  const {
    weight,
    height, // Altura fornecida no formul├írio em cm
    dias_exercicio,
    qualidade_alimentacao,
    obstaculos,
    objetivos,
    alvo_alcancado,
  } = req.body;
  const userId = req.user.id;

  if (!weight || !dias_exercicio || !qualidade_alimentacao || !obstaculos || !objetivos || !alvo_alcancado) {
    return res.status(400).json({
      error: "Peso, dias de exerc├¡cio, qualidade da alimenta├º├úo, obst├ículos, objetivos e alvo alcan├ºado s├úo obrigat├│rios.",
    });
  }

  try {
    let currentHeight;

    // Buscar altura do banco se n├úo fornecida no formul├írio
    if (!height || parseFloat(height) <= 0) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("height")
        .eq("id", userId)
        .single();

      if (userError || !userData || !userData.height) {
        return res.status(404).json({ error: "Altura n├úo encontrada para o usu├írio." });
      }
      currentHeight = parseFloat(userData.height).toFixed(2); // Altura em cm
    } else {
      // Atualizar altura no banco
      const alturaEmMetros = parseFloat(height).toFixed(2);

      if (parseFloat(alturaEmMetros) <= 0) {
        return res.status(400).json({ error: "Altura fornecida deve ser maior que zero." });
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ height: alturaEmMetros })
        .eq("id", userId);

        if (updateError) {
          return res.status(500).json({ error: "Erro ao atualizar a altura no banco de dados." });
        }

        currentHeight = alturaEmMetros; // Atualizar altura para c├ílculo
    }

    // Validar peso
    const weightValue = parseFloat(weight);
    if (weightValue <= 0) {
      return res.status(400).json({ error: "Peso deve ser maior que zero." });
    }

    // C├ílculo do IMC
    const currentHeightMeters = currentHeight; // Converter para metros
    const imc = (weightValue / (currentHeightMeters ** 2)).toFixed(2);

    if (!imc || isNaN(imc) || imc <= 0) {
      return res.status(400).json({ error: "Erro ao calcular o IMC. Verifique os dados fornecidos." });
    }

    // Inserir progresso no banco
    const { error } = await supabase.from("progress").insert([
      {
        user_id: userId,
        date: new Date().toISOString(),
        imc: parseFloat(imc),
        weight: weightValue,
        dias_exercicio: parseInt(dias_exercicio, 10),
        qualidade_alimentacao,
        obstaculos,
        objetivos,
        alvo_alcancado,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: "Erro ao salvar progresso no banco." });
    }

    res.status(201).json({ message: "Progresso salvo com sucesso." });
  } catch (err) {
    console.error("Erro ao salvar progresso:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};





const getProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    // Buscar peso e altura iniciais do usu├írio
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("weight, height")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ error: "Usu├írio n├úo encontrado." });
    }

    // Buscar progresso semanal
    const { data, error } = await supabase
      .from("progress")
      .select("date, imc, weight, dias_exercicio, qualidade_alimentacao, obstaculos")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) {
      return res.status(404).json({ error: "Progresso n├úo encontrado." });
    }

    // Preparar dados para o frontend
    const dates = ["Inicial", ...data.map((entry) => entry.date)];
    const weights = [userData.weight, ...data.map((entry) => entry.weight)];
    const imcValues = data.map((entry) => entry.imc);
    const dietQuality = data.map((entry) => entry.qualidade_alimentacao || "Sem registro");
    const obstacles = data.map((entry) => entry.obstaculos || "Nenhum");

    // Calcular dados da ├║ltima semana
    const lastWeekData = data[data.length - 1] || {};
    const daysExercised = lastWeekData.dias_exercicio || 0;
    const healthyEating = lastWeekData.qualidade_alimentacao
      ? lastWeekData.qualidade_alimentacao.toString()
      : "Sem registro";
    const lastWeekObstacles = lastWeekData.obstaculos || "Nenhum";

    // Retornar todos os dados necess├írios
    res.status(200).json({
      dates,
      weights,
      imcValues,
      dietQuality,
      obstacles,
      height: userData.height, // Retornar altura inicial tamb├®m
      lastWeekSummary: {
        daysExercised,
        healthyEating,
        lastWeekObstacles,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar progresso." });
  }
};

const getUserData = async (req, res) => {
  const userId = req.user.id;

  try {
    // Buscar dados do usu├írio, incluindo altura
    const { data, error } = await supabase
      .from("users")
      .select("id, name, height, weight")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Usu├írio n├úo encontrado." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar os dados do usu├írio." });
  }
};


const getImcCategories = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("progress")
      .select("imc")
      .eq("user_id", userId);

    if (error || !data) {
      return res.status(404).json({ error: "Progresso n├úo encontrado." });
    }

    // Categorizar os IMCs
    const categories = {
      "Abaixo do peso": 0,
      "Peso normal": 0,
      "Sobrepeso": 0,
      "Obesidade": 0,
    };

    data.forEach((entry) => {
      if (entry.imc < 18.5) categories["Abaixo do peso"]++;
      else if (entry.imc >= 18.5 && entry.imc <= 24.9) categories["Peso normal"]++;
      else if (entry.imc >= 25 && entry.imc <= 29.9) categories["Sobrepeso"]++;
      else categories["Obesidade"]++;
    });

    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ error: "Erro ao calcular categorias do IMC." });
  }
};

const getDietAndObstacles = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("progress")
      .select("date, qualidade_alimentacao, obstaculos")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error || !data) {
      return res.status(404).json({ error: "Dados n├úo encontrados." });
    }

    // Processar as semanas
    const weeks = data.map((entry) => {
      const date = new Date(entry.date);
      const week = `Semana ${Math.ceil(date.getDate() / 7)}`;
      return { ...entry, week }; // Adiciona a semana para cada entrada
    });

    const dietQualityCounts = {};
    const obstacleCounts = {};

    weeks.forEach((entry) => {
      dietQualityCounts[entry.qualidade_alimentacao] =
        (dietQualityCounts[entry.qualidade_alimentacao] || 0) + 1;

      obstacleCounts[entry.obstaculos] =
        (obstacleCounts[entry.obstaculos] || 0) + 1;
    });

    res.status(200).json({
      dietQualityCounts,
      obstacleCounts,
      weeks: weeks.map((w) => w.week), // Envia todas as semanas
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados." });
  }
};


const getObjectivesAndSuccess = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("progress")
      .select("objetivos, alvo_alcancado")
      .eq("user_id", userId);

    if (error || !data) {
      return res.status(404).json({ error: "Dados n├úo encontrados." });
    }

    const objectivesCounts = {};
    const successCounts = {};

    data.forEach((entry) => {
      objectivesCounts[entry.objetivos] = (objectivesCounts[entry.objetivos] || 0) + 1;
      successCounts[entry.alvo_alcancado] = (successCounts[entry.alvo_alcancado] || 0) + 1;
    });

    res.status(200).json({ objectivesCounts, successCounts });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados." });
  }
};

const getQuickHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("progress")
      .select("dias_exercicio, qualidade_alimentacao, obstaculos")
      .eq("user_id", userId)
      .order("date", { descending: true })
      .limit(7);

    if (error || !data) {
      return res.status(404).json({ error: "Hist├│rico n├úo encontrado." });
    }

    // Calculando resumo da semana
    const daysExercised = data.reduce((sum, entry) => sum + entry.dias_exercicio, 0);
    const healthyEatingDays = data.filter(
      (entry) => entry.qualidade_alimentacao === "Saud├ível" || entry.qualidade_alimentacao === "Muito Saud├ível"
    ).length;
    const obstacles = data.map((entry) => entry.obstaculos).join(", ") || "Nenhum";

    res.status(200).json({
      daysExercised,
      healthyEatingDays,
      obstacles,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar hist├│rico r├ípido." });
  }
};

const getLastProgressDate = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("progress")
      .select("date")
      .eq("user_id", userId)
      .order("date", { ascending: false }) // Garante ordem decrescente
      .limit(1); // Retorna apenas a data mais recente

    if (error) {
      console.error("Erro ao buscar progresso:", error);
      return res.status(500).json({ error: "Erro ao buscar progresso." });
    }

    if (!data || data.length === 0) {
      console.log("Nenhum registro encontrado para o usu├írio:", userId);
      return res.status(200).json({ lastProgressDate: null });
    }

    const lastDate = new Date(data[0]?.date);

    // Validar se a data ├® v├ílida
    if (isNaN(lastDate.getTime())) {
      console.error("Data inv├ílida no banco de dados:", data[0]?.date);
      return res.status(500).json({ error: "Data inv├ílida no banco de dados." });
    }

    console.log("├Ültima data encontrada no banco de dados:", lastDate);
    res.status(200).json({ lastProgressDate: lastDate.toISOString() });
  } catch (err) {
    console.error("Erro no servidor:", err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};


module.exports = { registerUser, loginUser, getDashboard, getProgress, saveProgress, getImcCategories, getDietAndObstacles, getObjectivesAndSuccess, getQuickHistory, getUserData, getLastProgressDate};
