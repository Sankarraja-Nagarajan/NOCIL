import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { DashboardService } from "../../../Services/dashboard.service";
import { Dashboard, InitialData } from "../../../Models/Dtos";
import { AuthResponse } from "../../../Models/authModel";
import { EncryptionService } from "../../../Services/encryption.service";
import { getSession, isNullOrEmpty } from "../../../Utils";

@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  authResponse: AuthResponse;
  loader: boolean = false;
  emp_id: string;
  headerStatus: string;
  displayedColumns: string[] = [
    "FormId",
    "Name",
    "VendorType",
    "Email",
    "Mobile",
    "CreatedOn",
    "Status",
    "PendingWith",
    "Action",
  ];
  dashboardAllData: Dashboard[] = [];
  dataSource = new MatTableDataSource(this.dashboardAllData);
  selection = new SelectionModel(true, []);
  initialDashboardData: InitialData = new InitialData();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _dashboard: DashboardService,
    private _router: Router,
    private _encryptor: EncryptionService,
  ) {}

  ngOnInit(): void {
    this.authResponse = JSON.parse(getSession("userDetails")) as AuthResponse;
    this.emp_id = this.authResponse.Employee_Id;
    // get dashboard data
    if (
      !isNullOrEmpty(this.authResponse) &&
      this.authResponse?.Role == "Admin"
    ) {
      this.getAllData();
      this.headerStatus = "All";
    } else {
      this.getInitialData();
      this.headerStatus = "Pending";
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  data(status: string) {
    switch (status) {
      case "Open":
        this.getAllOpenData();
        break;
      case "Pending":
        this.getAllPendingData();
        break;
      case "Approved":
        this.getAllApprovedData();
        break;
      case "Rejected":
        this.getAllRejectedData();
        break;
      case "SAP":
        this.getAllSAPData();
        break;
      default:
    }
  }

  filterTableData(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getInitialData() {
    
    this._dashboard.getInitialData(this.emp_id).subscribe({
      next: (res) => {
        this.dashboardAllData = res.Data as Dashboard[];
        this.dataSource = new MatTableDataSource(this.dashboardAllData);
        this.dataSource.paginator = this.paginator;
        this.initialDashboardData.Open = res.Open;
        this.initialDashboardData.Pending = res.Pending;
        this.initialDashboardData.Approved = res.Approved;
        this.initialDashboardData.Rejected = res.Rejected;
      },
      error: (err) => {
      },
    });
  }

  getAllData() {
    
    this._dashboard.getAllData().subscribe({
      next: (res) => {
        this.dashboardAllData = res.Data as Dashboard[];
        this.dataSource = new MatTableDataSource(this.dashboardAllData);
        this.dataSource.paginator = this.paginator;
        this.initialDashboardData.Open = res.Open;
        this.initialDashboardData.Pending = res.Pending;
        this.initialDashboardData.Approved = res.Approved;
        this.initialDashboardData.Rejected = res.Rejected;
        this.initialDashboardData.SAP = res.SAP;
      },
      error: (err) => {
      },
    });
  }

  getAllOpenData() {
    
    if (this.authResponse?.Role != "Admin") {
      this._dashboard.getInitiatedData(this.emp_id).subscribe({
        next: (res) => {
          if (res) {
            this.dashboardAllData = res as Dashboard[];
            this.dataSource = new MatTableDataSource(this.dashboardAllData);
            this.dataSource.paginator = this.paginator;
            this.headerStatus = "Open";
          }
        },
        error: (err) => {
        },
      });
    } else {
      this._dashboard.getAllInitiatedData().subscribe({
        next: (res) => {
          if (res) {
            this.dashboardAllData = res as Dashboard[];
            this.dataSource = new MatTableDataSource(this.dashboardAllData);
            this.dataSource.paginator = this.paginator;
            this.headerStatus = "Open";
          }
        },
        error: (err) => {
        },
      });
    }
  }

  getAllPendingData() {
    
    if (this.authResponse?.Role != "Admin") {
      this._dashboard.getPendingData(this.emp_id).subscribe({
        next: (res) => {
          if (res) {
            this.dashboardAllData = res as Dashboard[];
            this.dataSource = new MatTableDataSource(this.dashboardAllData);
            this.dataSource.paginator = this.paginator;
            this.headerStatus = "Pending";
          }
        },
        error: (err) => {
        },
      });
    } else {
      this._dashboard.getAllPendingData().subscribe({
        next: (res) => {
          if (res) {
            this.dashboardAllData = res as Dashboard[];
            this.dataSource = new MatTableDataSource(this.dashboardAllData);
            this.dataSource.paginator = this.paginator;
            this.headerStatus = "Pending";
          }
        },
        error: (err) => {
        },
      });
    }
  }

  getAllApprovedData() {
    
    if (this.authResponse?.Role != "Admin") {
      this._dashboard.getApprovedData(this.emp_id).subscribe({
        next: (res) => {
          if (res) {
            this.dashboardAllData = res as Dashboard[];
            this.dataSource = new MatTableDataSource(this.dashboardAllData);
            this.dataSource.paginator = this.paginator;
            this.headerStatus = "Approved";
          }
        },
        error: (err) => {
        },
      });
    } else {
      this._dashboard.getAllApprovedData().subscribe({
        next: (res) => {
          if (res) {
            this.dashboardAllData = res as Dashboard[];
            this.dataSource = new MatTableDataSource(this.dashboardAllData);
            this.dataSource.paginator = this.paginator;
            this.headerStatus = "Approved";
          }
        },
        error: (err) => {
        },
      });
    }
  }

  getAllRejectedData() {
    
    if (this.authResponse?.Role != "Admin") {
      this._dashboard.getRejectedData(this.emp_id).subscribe({
        next: (res) => {
          if (res) {
            this.dashboardAllData = res as Dashboard[];
            this.dataSource = new MatTableDataSource(this.dashboardAllData);
            this.dataSource.paginator = this.paginator;
            this.headerStatus = "Rejected";
          }
        },
        error: (err) => {
        },
      });
    } else {
      this._dashboard.getAllRejectedData().subscribe({
        next: (res) => {
          if (res) {
            this.dashboardAllData = res as Dashboard[];
            this.dataSource = new MatTableDataSource(this.dashboardAllData);
            this.dataSource.paginator = this.paginator;
            this.headerStatus = "Rejected";
          }
        },
        error: (err) => {
        },
      });
    }
  }

  getAllSAPData() {
    
    this._dashboard.getAllSAPData().subscribe({
      next: (res) => {
        if (res) {
          this.dashboardAllData = res as Dashboard[];
          this.dataSource = new MatTableDataSource(this.dashboardAllData);
          this.dataSource.paginator = this.paginator;
          this.headerStatus = "SAP";
        }
      },
      error: (err) => {
      },
    });
  }

  // Form Review - Review btn click
  formReview(element: Dashboard) {
    let jsonData = {
      Form_Id: element.FormId,
      V_Id: element.VendorTypeId,
      Status: element.Status,
    };

    this._router.navigate(["registration/form"], {
      queryParams: {
        data: this._encryptor.encrypt(JSON.stringify(jsonData)),
      },
    });
  }
}
