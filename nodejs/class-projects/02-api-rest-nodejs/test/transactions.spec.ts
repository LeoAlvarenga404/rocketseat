import { it, expect, beforeAll, afterAll, describe, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Transactions routes", () => {
  // antes de tudo, iniciar a aplicação
  beforeAll(async () => {
    await app.ready();
  });
  // no final, fechar a aplicação para liberar memória
  afterAll(async () => {
    await app.close();
  });
  // antes de cada teste, resetar e fazer as migrations para que cada teste seja encapsulado.
  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "outcome",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "outcome",
      });

    const cookies = createTransactionResponse.get("Set-Cookie") ?? [];

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: -5000,
      }),
    ]);
  });

  it("should be able to get a specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "income",
      });

    const cookies = createTransactionResponse.get("Set-Cookie") ?? [];

    const listTransactionsResponse = await request(app.server)
      .get(`/transactions/`)
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      })
    );
  });

  it("should be able to get the summary", async () => {

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Income Transaction",
        amount: 5000,
        type: "income",
      });

    const cookies = createTransactionResponse.get("Set-Cookie") ?? [];

    await request(app.server).post("/transactions")
    .set('Cookie', cookies)
    .send({
      title: "Outcome transaction",
      amount: 3000,
      type: "outcome",
    });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies);

    expect(summaryResponse.body.summary).toEqual({
      amount: 2000,
    });
  });
});
