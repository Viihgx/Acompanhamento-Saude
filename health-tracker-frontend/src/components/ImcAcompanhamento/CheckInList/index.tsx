import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./CheckInList.css";

interface WeekData {
  week: number;
  status: string;
  days: string[];
}

export default function CheckInList() {
  const [checkInDates, setCheckInDates] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para acessar esta página.");
      return;
    }

    api
      .get("/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const dates = response.data.dates
          .map((date: string) => {
            try {
              const normalizedDate = new Date(date);
              return normalizedDate.toISOString().split("T")[0];
            } catch (error) {
              console.error("Erro ao converter a data:", date, error);
              return null;
            }
          })
          .filter(Boolean) as string[];
        setCheckInDates(dates);
      })
      .catch((err) => console.error("Erro ao carregar progresso:", err));
  }, []);

  useEffect(() => {
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const tempWeeks: WeekData[] = [];
    let currentWeekDays: string[] = [];

    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];

      if (checkInDates.includes(dateStr)) {
        currentWeekDays.push(dateStr);
      }

      if (d.getDay() === 0 || d.getTime() === endOfMonth.getTime()) {
        const status = currentWeekDays.length > 0 ? "realizado" : "faltante";
        tempWeeks.push({
          week: tempWeeks.length + 1,
          status,
          days: [...currentWeekDays],
        });
        currentWeekDays = [];
      }
    }

    setWeeks(tempWeeks);
  }, [checkInDates, selectedMonth, selectedYear]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = e.target.value.split("-").map(Number);
    setSelectedYear(year);
    setSelectedMonth(month - 1);
  };

  return (
    <div className="checkin-list-container">
      <div className="month-selector">
        <select
          id="month"
          onChange={handleMonthChange}
          value={`${selectedYear}-${selectedMonth + 1}`}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const date = new Date(new Date().getFullYear(), i, 1);
            return (
              <option
                key={i}
                value={`${date.getFullYear()}-${String(i + 1).padStart(2, "0")}`}
              >
                {date.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
              </option>
            );
          })}
        </select>
      </div>
      <div className="checkin-summary">
        {weeks.map((week, index) => (
          <div className="checkin-item" key={index}>
            <div className={`line-indicator ${week.status}`}></div>
            <div className="checkin-content">
              <span className="week-label">Semana {week.week}</span>
              <span className={`status ${week.status}`}>
                {week.status === "realizado"
                  ? week.days.join(", ")
                  : "Faltante"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
