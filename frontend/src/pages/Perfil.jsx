import { useState, useEffect } from "react";
const avatares = ["😀", "😎", "🤖", "🐱", "🐶", "🌟", "⚡", "🎮", "🎨", "⚽"];
const temas = [
  { nome: "Azul", cor: "#4A90D9" },
  { nome: "Roxo", cor: "#9B59B6" },
  { nome: "Rosa", cor: "#E91E8C" },
  { nome: "Verde", cor: "#5CB85C" },
  { nome: "Laranja", cor: "#F0AD4E" },
];
function Perfil() {
  const [nome, setNome] = useState("");
  const [avatar, setAvatar] = useState(avatares[0]);
  const [foto, setFoto] = useState(null);
  const [corTema, setCorTema] = useState(temas[0].cor);
  const [salvo, setSalvo] = useState(false);
  useEffect(() => {
    const perfilSalvo = localStorage.getItem("perfilTaskteen");
    if (perfilSalvo) {
      const dados = JSON.parse(perfilSalvo);
      setNome(dados.nome || "");
      setAvatar(dados.avatar || avatares[0]);
      setFoto(dados.foto || null);
      setCorTema(dados.corTema || temas[0].cor);
    }
  }, []);
  function salvarPerfil() {
    localStorage.setItem(
      "perfilTaskteen",
      JSON.stringify({ nome, avatar, foto, corTema }),
    );
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }
  function escolherFoto(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => setFoto(leitor.result);
    leitor.readAsDataURL(arquivo);
  }
  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      {" "}
      <h1 style={{ marginBottom: "24px" }}>Perfil</h1>{" "}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {" "}
        {foto ? (
          <img
            src={foto}
            alt="Foto de perfil"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${corTema}`,
            }}
          />
        ) : (
          <div style={{ fontSize: "60px" }}>{avatar}</div>
        )}{" "}
        <div style={{ marginTop: "12px" }}>
          {" "}
          <label
            style={{
              cursor: "pointer",
              padding: "6px 12px",
              border: "1px solid #666",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            {" "}
            📷 Escolher foto do aparelho{" "}
            <input
              type="file"
              accept="image/*"
              onChange={escolherFoto}
              style={{ display: "none" }}
            />{" "}
          </label>{" "}
          {foto && (
            <button onClick={() => setFoto(null)} style={{ marginLeft: "8px" }}>
              {" "}
              Remover foto{" "}
            </button>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <div style={{ marginBottom: "24px" }}>
        {" "}
        <label style={{ display: "block", marginBottom: "8px" }}>
          Seu nome
        </label>{" "}
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como quer ser chamado(a)?"
          aria-label="Seu nome"
          style={{ width: "100%", padding: "8px" }}
        />{" "}
      </div>{" "}
      <div style={{ marginBottom: "24px" }}>
        {" "}
        <label style={{ display: "block", marginBottom: "8px" }}>
          {" "}
          Ou escolha um avatar {foto && "(desativado enquanto tiver foto)"}{" "}
        </label>{" "}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            opacity: foto ? 0.4 : 1,
          }}
        >
          {" "}
          {avatares.map((a) => (
            <button
              key={a}
              disabled={!!foto}
              onClick={() => setAvatar(a)}
              style={{
                fontSize: "24px",
                padding: "8px",
                border:
                  avatar === a ? `2px solid ${corTema}` : "1px solid #444",
                borderRadius: "8px",
                background: "transparent",
                cursor: foto ? "default" : "pointer",
              }}
            >
              {" "}
              {a}{" "}
            </button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      <div style={{ marginBottom: "28px" }}>
        {" "}
        <label style={{ display: "block", marginBottom: "8px" }}>
          Cor favorita
        </label>{" "}
        <div style={{ display: "flex", gap: "10px" }}>
          {" "}
          {temas.map((t) => (
            <button
              key={t.cor}
              onClick={() => setCorTema(t.cor)}
              title={t.nome}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: t.cor,
                border:
                  corTema === t.cor ? "3px solid white" : "1px solid #444",
                cursor: "pointer",
              }}
            />
          ))}{" "}
        </div>{" "}
      </div>{" "}
      <button
        onClick={salvarPerfil}
        style={{
          padding: "10px 20px",
          background: corTema,
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        {" "}
        Salvar perfil{" "}
      </button>{" "}
      {salvo && (
        <p style={{ color: "#5CB85C", marginTop: "10px" }}>✅ Perfil salvo!</p>
      )}{" "}
    </div>
  );
}
export default Perfil;
