import { faker } from "@faker-js/faker";

import {
  Answer,
  AnswerProps,
} from "@/domain/forum/enterprise/entities/answer";
import { UniqueEntityID } from "@/domain/forum/enterprise/entities/value-objects/unique-entity-id";

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID
) {
  const answer = Answer.create(
    {
      questionId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );

  return answer;
}
