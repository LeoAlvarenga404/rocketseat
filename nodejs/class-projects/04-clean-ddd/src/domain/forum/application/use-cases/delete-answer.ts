import { AnswersRepository } from "../repositories/answers-repository";

interface DeleteAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private AnswersRepository: AnswersRepository) {}
  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.AnswersRepository.findById(answerId);
    if (!answer) throw new Error("Answer not found.");

    if (authorId !== answer.authorId.toString()) {
      throw new Error("Not allowed.");
    }

    await this.AnswersRepository.delete(answer);

    return {};
  }
}
