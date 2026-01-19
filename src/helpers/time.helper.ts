import dayjs, { ManipulateType } from "dayjs";

export const timeHelper = {
    parseConfigString: (time: string) => {
        const [value, unit] = time.split(" ");
        return {
            value: parseInt(value),
            unit: unit as ManipulateType,
        };
    },
    subtractByParams: (value: number, unit: ManipulateType): Date => {
        return dayjs().subtract(value, unit).toDate();
    },
};
