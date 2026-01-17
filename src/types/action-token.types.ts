import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";

export interface IActionTokenDB {
    token: string;
    type: ActionTokenTypesEnum;
    userId: string;
}
