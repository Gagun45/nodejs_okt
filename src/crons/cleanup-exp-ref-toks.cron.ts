/* eslint-disable no-console */
import { CronJob } from "cron";

import { config } from "../config/config";
import { timeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const removeExpiredRefreshTokens = async () => {
    const { unit, value } = timeHelper.parseConfigString(
        config.JWT_REFRESH_EXPIRATION,
    );
    const date = timeHelper.subtractByParams(value, unit);
    const { deletedCount } = await tokenRepository.deleteMany({
        createdAt: { $lt: date },
    });
    console.log(`Removed ${deletedCount} expired refresh tokens`);
};

export const cleanupExpriredRefreshTokensJob = new CronJob(
    "0 * * * * *",
    removeExpiredRefreshTokens,
);
