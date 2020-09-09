import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'customers-form',
    styleUrls: ['customers-form.css'],
    templateUrl: 'customers-form.component.html',
})
export class CustomersFormComponent implements OnInit {

    panelOpenState = false;
    icon = ['chevron_left', 'chevron_right']
    index = 0

    dataSource = null;
    constructor(private _customerService: CustomersService,
        private route: ActivatedRoute,
        private router: Router) { }



    ngOnInit() {
        // get optional router params
        this.route.paramMap.subscribe((params: ParamMap) => {

            this._customerService.getCustomerFileByCode(params.get('id')).subscribe(data => {
                this.dataSource = data[0]
                console.log(data[0]);
                this.dataSource["EventDate"] = this.dataSource["EventDate"].slice(0, -13); // edit date format
                this.router.navigate(['fileDetails'], { relativeTo: this.route })
            });
        })
    }

    
    navigateTo(name: string) {
        this.router.navigate([name], { relativeTo: this.route })
    }

    toggleDrwer(drawer) {
        drawer.toggle();
        this.index = (this.index + 1) % 2
    }
}