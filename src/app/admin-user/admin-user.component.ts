import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { AdminUserService } from './admin-user.service';
import {MatTableDataSource} from '@angular/material/table';
import debounce from "lodash.debounce";

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

  displayedColumns: string[] = ['First Name', 'Last Name',  'Email' , 'Is Subscriber' , 'Actions'];
  dataSource: MatTableDataSource<any>;
  page: number = 1;
  limit: number = 5;
  totalItems : number = null;
  searchValue : string = "";


  constructor(private adminUserService : AdminUserService) { }

  ngOnInit(): void {
    this.getUserDetail();
  }


  getUserDetail(){
  const query = {
    page : this.page,
    limit : this.limit,
    searchValue : this.searchValue
  }
    this.adminUserService.getAllUsers(query).subscribe((data)=>{
      this.dataSource = data['data'][0]['data'];
      this.totalItems = data['data'][0]['count'][0]['count'];
    } , 
    (err)=>{
      Swal({
        type: "error",
        title: ` ${err.error.name}!`,
        text: err.error.message,
      });
    }
    )
  }

  onPageEvent = (event) => {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getUserDetail();
  };

  handleKeyPress = () => {
      this.debouncer();
  };

  debouncer = debounce(this.getUserDetail, 300);

}
