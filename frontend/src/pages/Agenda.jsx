import { useState, useEffect } from 'react';

const cores = {
  tarefa: '#4A90D9',
  trabalho: '#D9534F',
  esporte: '#5CB85C',
  lazer: '#F0AD4E',
};

function formatarData(d) {
  return d.toISOString().split('T')[0];
}

function inicioDaSemana(data) {
  const d = new Date(data);
  const diaSemana = d.getDay(); // 0 = domingo
  d.setDate(d.getDate() - diaSemana);
  return d;
}

function Agenda() {
  const [tarefas, setTarefas] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/api/tarefas')
      .then((res) => res.json())
      .then((dados) => setTarefas(dados));
  }, []);

  const hoje = new Date();
  const baseSemana = inicioDaSemana(hoje);
  baseSemana.setDate(baseSemana.getDate() + semanaOffset * 7);

  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseSemana);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h1>Agenda</h1>

      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <button onClick={() => setSemanaOffset(semanaOffset - 1)}>
          ← Semana anterior
        </button>
        <button onClick={() => setSemanaOffset(0)}>Hoje</button>
        <button onClick={() => setSemanaOffset(semanaOffset + 1)}>
          Próxima semana →
        </button>
      </div>

      {dias.map((dia) => {
        const dataStr = formatarData(dia);
        const tarefasDoDia = tarefas.filter((t) => t.data === dataStr);
        const ehHoje = dataStr === formatarData(hoje);

        return (
          <div
            key={dataStr}
            style={{
              border: ehHoje ? '2px solid #4A90D9' : '1px solid #444',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '8px',
            }}
          >
            <strong style={{ textTransform: 'capitalize' }}>
              {dia.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
              })}
              {ehHoje && ' (hoje)'}
            </strong>

            {tarefasDoDia.length === 0 ? (
              <p style={{ fontSize: '14px', opacity: 0.6, margin: '4px 0 0' }}>
                Nada por aqui
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
                {tarefasDoDia.map((t) => (
                  <li
                    key={t.id}
                    style={{
                      borderLeft: `4px solid ${cores[t.categoria] || '#999'}`,
                      padding: '4px 8px',
                      marginBottom: '4px',
                      textDecoration: t.feito ? 'line-through' : 'none',
                      opacity: t.feito ? 0.6 : 1,
                    }}
                  >
                    {t.titulo}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Agenda;