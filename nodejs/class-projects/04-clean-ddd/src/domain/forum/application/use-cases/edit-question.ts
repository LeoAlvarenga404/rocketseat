import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";

interface EditQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
}

interface EditQuestionUseCaseResponse {
  question: Question;
}

export class EditQuestionUseCase {
  constructor(private QuestionsRepository: QuestionsRepository) {}
  async execute({
    content,
    title,
    authorId,
    questionId,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.QuestionsRepository.findById(questionId);
    if (!question) throw new Error("Question not found.");

    if (authorId !== question.authorId.toString()) {
      throw new Error("Not allowed.");
    }

    question.title = title;
    question.content = content;

    await this.QuestionsRepository.save(question);

    return { question };
  }
}
