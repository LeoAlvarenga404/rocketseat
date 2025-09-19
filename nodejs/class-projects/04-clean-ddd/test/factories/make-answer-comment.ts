import { faker } from "@faker-js/faker";

import {
  AnswerComment,
  AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { UniqueEntityID } from "@/domain/forum/enterprise/entities/value-objects/unique-entity-id";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID
) {
  const answercomment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );

  return answercomment;
}
