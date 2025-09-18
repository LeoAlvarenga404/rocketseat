import { QuestionsRepository } from "../repositories/questions-repository";

interface DeleteQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
}

interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private QuestionsRepository: QuestionsRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.QuestionsRepository.findById(questionId);
    if (!question) throw new Error("Question not found.");

    if (authorId !== question.authorId.toString()) {
      throw new Error("Not allowed.");
    }

    await this.QuestionsRepository.delete(question);

    return {};
  }
}
