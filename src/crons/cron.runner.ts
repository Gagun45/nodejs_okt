import { cleanupExpriredRefreshTokensJob } from "./cleanup-exp-ref-toks.cron";
import { cleanupOldPasswords } from "./cleanup-old-passwords.cron";

export const cronRunner = () => {
    cleanupExpriredRefreshTokensJob.start();
    cleanupOldPasswords.start();
};
