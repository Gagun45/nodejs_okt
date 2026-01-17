import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";

export interface IActionToken {
    token: string;
    type: ActionTokenTypesEnum;
    userId: string;
}
