import { cleanupExpriredRefreshTokensJob } from "./cleanup-exp-ref-toks.cron";

export const cronRunner = () => {
    cleanupExpriredRefreshTokensJob.start();
};
