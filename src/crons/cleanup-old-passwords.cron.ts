/* eslint-disable no-console */
import { CronJob } from "cron";

import { timeHelper } from "../helpers/time.helper";
import { oldPasswordRepository } from "../repositories/old-password.repository";

const removeOldPasswords = async () => {
    try {
        const date = timeHelper.subtractByParams(180, "days");
        const { deletedCount } = await oldPasswordRepository.deleteMany({
            createdAt: { $lt: date },
        });
        console.log(`Removed ${deletedCount} old passwords`);
    } catch (e) {
        console.error("CRON remove old passwords fail", e);
    }
};

export const cleanupOldPasswords = new CronJob(
    "0 0 0 * * *", //every day at 00:00
    removeOldPasswords,
);
