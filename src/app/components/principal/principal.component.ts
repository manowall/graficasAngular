import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { forkJoin, map } from 'rxjs';
import { CovidService } from 'src/app/services/covid.service';
import { ChartConfiguration, DatasetController } from 'chart.js';
import { ChartType} from 'chart.js';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  locale = 'es';
  countries:string[] = [];
  country:string;

  dateInit:Date;
  dateEnd:Date;
  minDate:Date;
  maxDate:Date;

  constructor(private localeService: BsLocaleService, private covidService:CovidService, private datePipe:DatePipe) {
    localeService.use(this.locale);
    this.minDate = new Date('2020-1-22');
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate()-1);
  }

  ngOnInit(): void {
    this.getCountries();
    this.covidService.twoDates('Spain', new Date('2020-1-22'), new Date('2020-1-24')).subscribe(
      data =>{
        console.log(data);
      }
    );
  }

  public lineChartType: ChartType = 'line';

  getCountries():void{
    this.covidService.getAll().subscribe(data =>{
      this.countries = Object.keys(data);
    });
  }

  loadData(event:any):void{
    if(this.country && this.dateInit && this.dateEnd){
      forkJoin([
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data =>
          data.map( val => val.confirmed))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data =>
          data.map( val => val.recovered))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data =>
          data.map( val => val.confirmed - val.recovered - val.deaths))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data =>
          data.map( val => val.deaths))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data =>
          data.map( val => this.datePipe.transform(val.date, 'dd/MM')))),
      ]).subscribe(([data0, data1, data2, data3, data4])=>{
        this.lineChartData.datasets[0].data = data0;
        this.lineChartData.datasets[1].data = data1;
        this.lineChartData.datasets[2].data = data2;
        this.lineChartData.datasets[3].data = data3;
        this.lineChartData.labels = data4;
      });
    }
  }

  public lineChartData: ChartConfiguration['data'] = {
    labels: [ ],
    datasets: [
      {
        data: [],
        label: 'Confirmados',
        fill: true,
        tension: 0.5,
        borderColor: 'yellow',
        backgroundColor: 'rgba(254, 248, 51, 0.8)'
      },
      {
        data: [],
        label: 'Recuperados',
        fill: true,
        tension: 0.5,
        borderColor: 'green',
        backgroundColor: 'rgba(92, 246, 76, 0.8)'
      },
      {
        data: [],
        label: 'Activos',
        fill: true,
        tension: 0.5,
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.3)'
      },
      {
        data: [],
        label: 'Fallecidos',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(36, 36, 36, 0.8)'
      }

    ]
  };
  public lineChartOptions = {
    responsive: true
  };
  public lineChartLegend = true;

}
