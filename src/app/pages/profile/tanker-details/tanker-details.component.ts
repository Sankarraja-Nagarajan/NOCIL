import { Component, EventEmitter, Output } from '@angular/core';
import { TankerDetail } from '../../../Models/Dtos';
import { RegistrationService } from '../../../Services/registration.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/snackbar-status';
import { MasterService } from '../../../Services/master.service';
import { TankerType } from '../../../Models/Master';

@Component({
  selector: "ngx-tanker-details",
  templateUrl: "./tanker-details.component.html",
  styleUrls: ["./tanker-details.component.scss"],
})
export class TankerDetailsComponent {
  @Output() hasTankerDetail: EventEmitter<any> = new EventEmitter();

  tankerDetails: TankerDetail = new TankerDetail();
  vendorInfo: any;
  formId: number;
  typeOfTankers: TankerType[] = [];
  capacityoftank: number;
  tanktype: string;
  tanker: TankerType;
  constructor(
    private _registration: RegistrationService,
    private _master: MasterService,
    private _commonService: CommonService
  ) {}
  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;
    this.getMasterData();
  }
  getMasterData() {
    this._registration.getFormData(this.formId, "TankerDetails").subscribe({
      next: (res) => {
        if (res) {
          if(res.length>0){
            this.tankerDetails = res as TankerDetail;
            this.capacityoftank = this.tankerDetails[0].Capacity_of_Tanker;
            if(this.tankerDetails.Tanker_Type_Id != 0){
              this.GetTankerDetails();
            }
          }
          this.hasTankerDetail.emit(res.length!=0);
        }
        else{
          this.hasTankerDetail.emit(false);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
        this.hasTankerDetail.emit(false);
      },
    });

  }
  GetTankerDetails(): void {
    this._master.getTankerTypes().subscribe({
      next: (data) => {
        if (data) {
          this.typeOfTankers = data as TankerType[];
          this.tanker = this.typeOfTankers.find(
            (x) => x.Tanker_Type_Id == this.tankerDetails[0].Tanker_Type_Id
          );
          this.tanktype = this.tanker.Tanker_Type;
        }
      },
    });
  }
}
