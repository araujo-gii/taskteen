process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../server");
describe("API de Tarefas", () => {
  test("GET /api/health retorna status ok", async () => {
    const resposta = await request(app).get("/api/health");
    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.status).toBe("ok");
  });
  test("cria uma tarefa e ela aparece na listagem", async () => {
    await request(app)
      .post("/api/tarefas")
      .send({
        titulo: "Tarefa de teste",
        categoria: "tarefa",
        data: "2026-09-10",
      });
    const resposta = await request(app).get("/api/tarefas");
    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.length).toBeGreaterThan(0);
    expect(resposta.body[0].titulo).toBe("Tarefa de teste");
  });
  test("marca uma tarefa como feita", async () => {
    const criada = await request(app)
      .post("/api/tarefas")
      .send({ titulo: "Marcar feita", categoria: "lazer", data: "2026-09-11" });
    const resposta = await request(app)
      .put(`/api/tarefas/${criada.body.id}`)
      .send({ feito: 1 });
    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.sucesso).toBe(true);
  });
  test("apaga uma tarefa", async () => {
    const criada = await request(app)
      .post("/api/tarefas")
      .send({
        titulo: "Apagar depois",
        categoria: "lazer",
        data: "2026-09-12",
      });
    const resposta = await request(app).delete(
      `/api/tarefas/${criada.body.id}`,
    );
    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.sucesso).toBe(true);
  });
});
