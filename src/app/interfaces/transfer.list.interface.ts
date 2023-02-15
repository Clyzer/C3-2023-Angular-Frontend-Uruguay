import { AccountModel } from './account.interface';
import { TransferResponseModel } from './transfer.response.interface';

export interface TransferListModel {
  account: AccountModel;
  transfers: TransferResponseModel[];
}
