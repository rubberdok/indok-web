import { UsersRepository } from "../../repository/users";

type Dependencies = {
  usersRepository: UsersRepository;
};

export const UsersService = ({ usersRepository }: Dependencies) => ({
  get: async (id: string) => usersRepository.get(id),
  getAll: async () => usersRepository.getAll(),
});

export type UsersService = ReturnType<typeof UsersService>;
