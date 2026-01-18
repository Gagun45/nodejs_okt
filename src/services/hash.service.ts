import bcrypt from "bcrypt";

export const hashService = {
    hash: async (value: string): Promise<string> => {
        return await bcrypt.hash(value, 10);
    },
    compare: async (value: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(value, hash);
    },
};
