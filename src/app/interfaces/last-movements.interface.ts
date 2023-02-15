import { AccountModel } from "./account.interface";

export interface LastMovementsModel {
  id: string;
  outcome: AccountModel;
  balance: number;
  dateTime: string;
  type: string;
}
