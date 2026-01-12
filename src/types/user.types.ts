export interface IUser {
    id: number;
    name: string;
    age: number;
}

export type CreateUserDto = Omit<IUser, "id">;
