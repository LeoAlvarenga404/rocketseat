import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";

export function makeFetchNearbyGymUseCase() {
  const GymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUseCase(GymsRepository);

  return useCase;
}
