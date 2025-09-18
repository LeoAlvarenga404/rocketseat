import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueEntityID } from "../../enterprise/entities/value-objects/unique-entity-id";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });
  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-01"),
      },
      new UniqueEntityID("answer-01")
    );

    inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({ answerId: "answer-01", authorId: "author-01" });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-01"),
      },
      new UniqueEntityID("answer-01")
    );

    inMemoryAnswersRepository.create(newAnswer);

    await expect(() =>
      sut.execute({ answerId: "answer-01", authorId: "author-02" })
    ).rejects.toBeInstanceOf(Error);
  });
});
