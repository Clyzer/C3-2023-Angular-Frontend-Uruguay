import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, asyncScheduler } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { CustomerModel } from 'src/app/interfaces/customer.interface';
import { AuthGuard } from '../../login/guards/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class CustomersTableService implements OnDestroy {

  protected newDataCustomers: CustomerModel[] = [];
  public customersEmitter: BehaviorSubject<CustomerModel[]> = new BehaviorSubject<CustomerModel[]>(this.newDataCustomers);

  constructor(private api: ApiService, private guard: AuthGuard) { }

  ngOnDestroy(): void {
    this.customersEmitter.unsubscribe();
  }

  updateAllCustomers = () => {
    if(this.customersEmitter.observed && !this.customersEmitter.closed && this.guard.canActivate()){
        this.api.getAllCustomers().subscribe({
        next: (value) => { this.newDataCustomers = value; },
        complete: () => {
          this.customersEmitter.next(this.newDataCustomers);
          asyncScheduler.schedule(this.updateAllCustomers, 1000); }
        });
    } else {
      asyncScheduler.schedule(this.updateAllCustomers, 100);
    }
  }

}
