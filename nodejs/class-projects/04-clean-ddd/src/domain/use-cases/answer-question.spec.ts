import { AnswerQuestionUseCase } from "./answer-question";
import { AnswerRepository } from "@/repositories/answers-repository";
import { Answer } from "../entities/answer";

const fakeAnswersRepository: AnswerRepository = {
  create: async (answer: Answer) => {
    return;
  },
};

it("should be able to create a answer", async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

  const answer = await answerQuestion.execute({
    instructorId: "1",
    questionId: "1",
    content: "Nova Resposta",
  });

  expect(answer.content).toEqual("Nova Resposta");
});
