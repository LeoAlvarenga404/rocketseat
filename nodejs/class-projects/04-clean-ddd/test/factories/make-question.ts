import { faker } from "@faker-js/faker";

import {
  Question,
  QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { UniqueEntityID } from "@/domain/forum/enterprise/entities/value-objects/unique-entity-id";

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );

  return question;
}
