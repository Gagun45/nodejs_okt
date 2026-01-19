/* eslint-disable no-console */
import { CronJob } from "cron";

import { config } from "../config/config";
import { ApiError } from "../errors/api-error";
import { timeHelper } from "../helpers/time.helper";
import { tokenService } from "../services/token.service";

const removeExpiredRefreshTokens = async () => {
    try {
        const { unit, value } = timeHelper.parseConfigString(
            config.JWT_REFRESH_EXPIRATION,
        );
        const date = timeHelper.subtractByParams(value, unit);
        const { deletedCount } = await tokenService.deleteMany({
            createdAt: { $lt: date },
        });
        console.log(`Removed ${deletedCount} expired refresh tokens`);
    } catch {
        throw new ApiError("CRON remove expired refresh token fail", 500);
    }
};

export const cleanupExpriredRefreshTokensJob = new CronJob(
    "0 0 0 * * 3", //every Thursday at 00:00
    removeExpiredRefreshTokens,
);
