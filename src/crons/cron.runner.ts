import { cleanupExpriredRefreshTokensJob } from "./test.cron";

export const cronRunner = () => {
    cleanupExpriredRefreshTokensJob.start();
};
