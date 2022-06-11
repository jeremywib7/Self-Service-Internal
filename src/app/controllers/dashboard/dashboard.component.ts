import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Product} from "../../api/product";
import {firstValueFrom, Subscription} from "rxjs";
import {AppConfig} from "../../api/appconfig";
import {ProductService} from "../../service/productservice";
import {ConfigService} from "../../service/app.config.service";
import {DashboardService} from "../../service/dashboard.service";
import {Dashboard} from "../../model/Dashboard";
import {CustomerOrder} from "../../model/customerOrder/CustomerOrder";
import {TotalSalesProduct} from "../../model/TotalSalesProduct";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    items: MenuItem[];


    recentSales: CustomerOrder[] = [];

    top5BestSales: TotalSalesProduct[] = [];


    chartData: any;

    chartOptions: any;

    isDoneLoadDashboardData: boolean = false;

    subscription: Subscription;

    tableSkeleton: string[] = [];

    dashboardData: Dashboard = new Dashboard();

    monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentMonthName: string;

    config: AppConfig;

    constructor(
        private productService: ProductService,
        public configService: ConfigService,
        private dashboardService: DashboardService) {
    }

    ngOnInit() {
        let d = new Date();
        this.currentMonthName = this.monthsList[d.getMonth()];

        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
            this.updateChartOptions();
        });

        this.items = [
            {label: 'Add New', icon: 'pi pi-fw pi-plus'},
            {label: 'Remove', icon: 'pi pi-fw pi-minus'}
        ];

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: '#2f4860',
                    borderColor: '#2f4860',
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 120],
                    fill: false,
                    backgroundColor: '#00bb7e',
                    borderColor: '#00bb7e',
                    tension: .4
                }
            ]
        };

        this.initTableSkeletonData();

        this.loadDashboardData().then(r => null);
    }

    initTableSkeletonData() {
        for (let i = 0; i < 5; i++) {
            this.tableSkeleton.push("");
        }
    }

    topSalesColorBg(index: number) {
        switch (index) {
            case 1:
                return "bg-orange-500";
            case 2:
                return "bg-cyan-500";
            case 3:
                return "bg-pink-500";
            case 4:
                return "bg-green-500";
            case 5:
                return "bg-purple-500";
            case 6:
                return "bg-teal-500";
            default:
                return "bg-teal-500";
        }
    }

    topSalesColorText(index: number) {
        switch (index) {
            case 1:
                return "text-orange-500";
            case 2:
                return "text-cyan-500";
            case 3:
                return "text-pink-500";
            case 4:
                return "text-green-500";
            case 5:
                return "text-purple-500";
            case 6:
                return "text-teal-500";
            default:
                return "text-teal-500";
        }
    }


    async loadDashboardData() {
        const res = await firstValueFrom(this.dashboardService.loadDashboardData());
        this.dashboardData = res.data;
        this.recentSales = res.data.recentOrder;
        this.top5BestSales = res.data.top5BestSales;

        console.log(res.data);
        this.isDoneLoadDashboardData = true;
    }

    updateChartOptions() {
        if (this.config.dark)
            this.applyDarkTheme();
        else
            this.applyLightTheme();

    }

    applyDarkTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };
    }

    applyLightTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };
    }

    s


}
