import { ApiError } from "../errors/api-error";
import { fsService } from "../services/fs.service";
import { CreateUserDto, IUser } from "../types/user.types";
import { validateAgeOrThrow, validateNameOrThrow } from "../validation";

export const userRepository = {
    getUsers: async (): Promise<IUser[]> => {
        return await fsService.read();
    },
    createUser: async (dto: Partial<IUser>): Promise<IUser> => {
        const { age, name } = dto;
        const users = await fsService.read();
        if (!name || !age) throw new ApiError("Some fields are missing", 400);
        validateNameOrThrow(name);
        validateAgeOrThrow(age);
        const newUser: IUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1,
            name,
            age,
        };
        users.push(newUser);
        await fsService.write(users);
        return newUser;
    },
    getUserById: async (userId: number): Promise<IUser | undefined> => {
        const users = await fsService.read();
        const user = users.find((user) => user.id === userId);
        return user;
    },
    deleteUserById: async (userId: number): Promise<void> => {
        const users = await fsService.read();

        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) throw new ApiError("User not found", 404);

        users.splice(userIndex, 1);
        await fsService.write(users);
    },
    putUserById: async (userId: number, dto: CreateUserDto): Promise<IUser> => {
        const users = await fsService.read();
        const existingUser = users.find((user) => user.id === userId);
        if (!existingUser) throw new ApiError("User not found", 404);
        const { name, age } = dto;
        if (name === undefined || age === undefined)
            throw new ApiError("Some fields are missing", 400);

        validateNameOrThrow(name);
        validateAgeOrThrow(age);

        existingUser.name = name;
        existingUser.age = age;

        await fsService.write(users);
        return existingUser;
    },

    patchUserById: async (
        userId: number,
        dto: Partial<IUser>,
    ): Promise<IUser> => {
        const users = await fsService.read();
        const existingUser = users.find((user) => user.id === userId);
        if (!existingUser) throw new ApiError("User not found", 404);
        const { name, age } = dto;
        if (name === undefined && age === undefined)
            throw new ApiError("No fields provided", 400);
        if (name !== undefined) {
            validateNameOrThrow(name);
            existingUser.name = name;
        }
        if (age !== undefined) {
            validateAgeOrThrow(age);
            existingUser.age = age;
        }
        await fsService.write(users);
        return existingUser;
    },
    resetUsers: async (): Promise<void> => await fsService.reset(),
};
