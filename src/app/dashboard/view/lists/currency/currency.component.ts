import { Component } from '@angular/core';
import { Convert, Converter } from "easy-currencies";

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent {

  converter: Converter = new Converter();
  usd: number = 0;
  eur: number = 0;
  real: number = 0;
  punds: number = 0;

  banktax: number = 5.9;

  constructor(){
    this.currencyNow();
  }

  async currencyNow() {
    this.usd = await this.converter.convert(1, "USD", "UYU");
    this.eur = await this.converter.convert(1, "EUR", "UYU");
    this.real = await this.converter.convert(1, "BRL", "UYU");
    this.punds = await this.converter.convert(1, "GBP", "UYU");
  }


}
