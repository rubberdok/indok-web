import "reflect-metadata"

import { User } from "@prisma/client"
import dayjs from "dayjs"
import { Container } from "inversify"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"

import { IUserRepository, Types as RepositoryTypes } from "@/repositories"
import { Types as ServiceTypes } from "@/services"
import { IUserService } from "@/services/interfaces"
import UserService from "@/services/users"
import { TestCase } from "./interfaces"

const dummyUser = mockDeep<User>()

const time = new Date(`${dayjs().year() + 1}-01-01`)
let container: Container

beforeAll(() => {
  container = new Container()
  container.unbindAll()

  const mockUserService = mockDeep<IUserRepository>()
  container.bind<DeepMockProxy<IUserRepository>>(RepositoryTypes.UserRepository).toConstantValue(mockUserService)
  container.bind<IUserService>(ServiceTypes.UserService).to(UserService)
  jest.useFakeTimers().setSystemTime(time)
})

describe("UserService", () => {
  const testCases: TestCase[] = [
    {
      name: "set firstLogin to false",
      input: {
        firstName: "test",
      },
      updateInput: {
        firstName: "test",
        firstLogin: false,
      },
      existing: {
        ...dummyUser,
        id: "1",
        firstLogin: true
      },
      expected: {
        ...dummyUser,
        firstName: "test",
        firstLogin: false,
      },
    },
    {
      name: "not set `graduationYearUpdatedAt` on first login",
      input: {
        graduationYear: dayjs().year() + 1,
      },
      updateInput: {
        firstLogin: false,
        graduationYear: dayjs().year() + 1,
      },
      existing: {
        ...dummyUser,
        id: "1",
        firstLogin: true,
        graduationYear: null,
        graduationYearUpdatedAt: null,
      },
      expected: {
        ...dummyUser,
        graduationYearUpdatedAt: null,
        graduationYear: dayjs().year() + 1,
      },
    },
    {
      name: "set `graduationYearUpdatedAt` on on graduation year update",
      input: {
        graduationYear: dayjs().year() + 1,
      },
      updateInput: {
        graduationYear: dayjs().year() + 1,
        graduationYearUpdatedAt: time,
      },
      existing: {
        ...dummyUser,
        id: "1",
        firstLogin: false,
        graduationYear: null,
        graduationYearUpdatedAt: null,
      },
      expected: {
        ...dummyUser,
        graduationYearUpdatedAt: time,
        graduationYear: dayjs().year() + 1,
      },
    },
    {
      name: "disallow updating graduation year within one year",
      input: {
        graduationYear: dayjs().year() + 1,
      },
      updateInput: {},
      existing: {
        ...dummyUser,
        id: "1",
        firstLogin: false,
        graduationYear: dayjs().year(),
        graduationYearUpdatedAt: dayjs(time).subtract(1, "year").add(1, "minute").toDate(),
      },
      expected: {
        ...dummyUser,
        graduationYearUpdatedAt: time,
        graduationYear: dayjs().year(),
      },
    },
    {
      name: "update `graduationYearUpdatedAt` if changed after one year",
      input: {
        graduationYear: dayjs().year() + 1,
      },
      updateInput: {
        graduationYear: dayjs().year() + 1,
        graduationYearUpdatedAt: time,
      },
      existing: {
        ...dummyUser,
        id: "1",
        firstLogin: false,
        graduationYear: dayjs().year(),
        graduationYearUpdatedAt: dayjs(time).subtract(1, "year").subtract(1, "minute").toDate(),
      },
      expected: {
        ...dummyUser,
        graduationYearUpdatedAt: time,
        graduationYear: dayjs().year() + 1,
      },
    },
  ]

  test.each(testCases)("should %s", async ({ name, existing, expected, input, updateInput }) => {
    const repo = container.get<DeepMockProxy<IUserRepository>>(RepositoryTypes.UserRepository)
    const service = container.get<IUserService>(ServiceTypes.UserService)
    repo.get.mockReturnValueOnce(Promise.resolve(existing))
    repo.update.mockReturnValueOnce(Promise.resolve(expected))

    const actual = await service.update(existing.id, input)
    
    expect(repo.get).toBeCalledWith(existing.id)
    expect(repo.update).toBeCalledWith(existing.id, updateInput)
    expect(actual).toMatchObject(expected)
  })
})