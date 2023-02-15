import { AccountModel } from './account.interface';
import { DepositResponseModel } from './deposit.response.interface';

export interface DepositListModel {
  account: AccountModel;
  deposits: DepositResponseModel[];
}
