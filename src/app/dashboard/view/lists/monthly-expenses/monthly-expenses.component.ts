import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { LastMovementsModel } from 'src/app/interfaces/last-movements.interface';
import { LastMovementsCustomerService } from '../last-movements-customer/last-movements-customer.service';
Chart.register(...registerables);

@Component({
  selector: 'app-monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.scss']
})
export class MonthlyExpensesComponent {

  protected lastMovementsFinal: LastMovementsModel[] = [];
  public chart!: Chart<"doughnut", number[], string>;

  constructor(protected lastMovementsCustomerService: LastMovementsCustomerService){
    this.lastMovementsCustomerService.lastMovementsFinalEmitter.subscribe({
      next: (data: LastMovementsModel[]) => {
        if (JSON.stringify(this.lastMovementsFinal) !== JSON.stringify(data)) {
          this.lastMovementsFinal = data;
          if(this.chart){
            this.chart.destroy();
          }
          this.createChart();
        }
      }
    })
  }

  createChart(){
    let transfers: number = 0;
    let deposits: number = 0;
    this.lastMovementsFinal.forEach((value) => {
      if (value.type === "Transferencia") transfers++
      if (value.type === "Deposito") deposits++
    })
    this.chart = new Chart("monthly", {
      type: 'doughnut',
      data: {
        labels: ['Depositos', 'Transferencias'],
        datasets: [{
          label: 'Monto',
          data: [deposits, transfers],
          borderWidth: 1
        }]
      },
      options: {
        radius: '80%'
      }
    });
  }

}
