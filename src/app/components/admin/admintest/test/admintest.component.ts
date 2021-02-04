import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { AdminTestService } from '../../../../services/admin/admintest.service';
import { Test } from '../../../../../../shared/models/Test';
import debounce from "lodash.debounce";
import Swal from 'sweetalert2';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
		selector: 'app-adminTest',
		templateUrl: './adminTest.component.html',
		styleUrls: ['./adminTest.component.css']
})
export class AdminTestComponent implements OnInit {
    dataSource: any = [];
    filterVisibility = false;
    editVisibility = false;
    editBar : Test = {
        invoice: '',
      };
    
      invoiceFilter = new FormControl('');
      
    filterValues = {
      
        invoice: '',
      
    }
    displayedColumns = ["invoice"];
    page:number = 1;
    length:number
    pageSizeOptions:number[] = [ 10, 25, 50 , 100] ;
    pageSize:number = 50;
    searchValue = "";
		constructor(private AdminTestService: AdminTestService) {}

		ngOnInit() {
      
        this.invoiceFilter.valueChanges
            .subscribe(
              invoice => {
                    this.filterValues.invoice = invoice;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
      
      this.getadminTests();
    }
    tableFilter(): (data: any, filter: string) => boolean {
      const filterFunction = function (data, filter): boolean {
          const searchTerms = JSON.parse(filter);
          return data.name.toLowerCase().indexOf(searchTerms.name) !== -1
              && data.id.toString().toLowerCase().indexOf(searchTerms.id) !== -1;
      };
      return filterFunction;
  }
  toggleFilter() {
      this.filterVisibility = !this.filterVisibility;
  }

  handleSearch = () => {
    this.getadminTests();
  };

  debouncer = debounce(this.handleSearch, 300);

  handleKeyPress = () => {
    this.debouncer();
  };

  openEditBar(row) {
    this.editVisibility = true;
    Object.keys(row).forEach((dataItem) => {
        this.editBar[dataItem] = row[dataItem];

    });

}
getPaginationParams(){
  return {
    page : this.page,
    pageSize : this.pageSize,
    searchValue: this.searchValue,
  }
}
getadminTests(){
  const query = this.getPaginationParams();
  this.AdminTestService
  .getAll(query)
  .subscribe(
  (admintests : any) => {
    this.dataSource = new MatTableDataSource(admintests[0]['data']);
    this.length = admintests[0]['count'][0]['count'];
    this.dataSource.filterPredicate = this.tableFilter();
  },
  (error : any) => {
    Swal({
      type: 'error',
      title: `Oops... ${error.error.name}!`,
      text: error.error.message
    });
    console.error(`Error: ${error}`);
    throw error;
  }
  );  
}  

onPageEvent = event => {
  this.pageSize = event.pageSize;
  this.page = event.pageIndex + 1;
  this.getadminTests();
};
clickDrop(e) {
  const filterCardCheck = (<HTMLElement>(<HTMLElement>event.target).parentNode).closest('.filter-card');
  const filterButtonCheck = (<HTMLElement>(<HTMLElement>event.target).parentNode).closest('#filter-button');
  if (!filterCardCheck && !filterButtonCheck) {
      this.filterVisibility = false;
  }

  const matTableCheck = (<HTMLElement>(<HTMLElement>event.target).parentNode).closest('mat-table');
  const editCardCheck = (<HTMLElement>(<HTMLElement>event.target).parentNode).closest('.edit-card');
  if (!matTableCheck && !editCardCheck) {
      this.editVisibility = false;
  }

}

saveBar() {
  this.AdminTestService.update(this.editBar).subscribe(data => {
      this.ngOnInit();
      this.editVisibility = false;
  });
}

}
      