import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Attachment } from "../../Models/Dtos";
import { CommonService } from "../../Services/common.service";
import { snackbarStatus } from "../../Enums/snackbar-status";
import { AppConfigService } from "../../Services/app-config.service";
import { AttachmentService } from "../../Services/attachment.service";

@Component({
  selector: "ngx-attachment-dialog",
  templateUrl: "./attachment-dialog.component.html",
  styleUrls: ["./attachment-dialog.component.scss"],
})
export class AttachmentDialogComponent implements OnInit {
  attachmentForm: FormGroup;
  document = new FormControl("", Validators.required);

  fileName: string;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  form_Id: number;
  selectedFile: File = null;
  isFileUploaded: boolean = false;
  currentDate: Date = new Date();
  loader: boolean = false;

  constructor(
    public _dialogRef: MatDialogRef<AttachmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _common: CommonService,
    private _config: AppConfigService,
    private _fb: FormBuilder,
    private _attach: AttachmentService
  ) {
    this.form_Id = data.form_Id;
  }

  ngOnInit(): void {
    this.attachmentForm = this._fb.group({
      File_Type: ["", [Validators.required]],
      Is_Expiry_Available: [true],
      Expiry_Date: [""],
    });

    this.changeValidators();

    this.options = this._config.get("Attachment_Types").split(",");
    this.filteredOptions = this.attachmentForm
      .get("File_Type")
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value || ""))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  changeValidators() {
    if (this.attachmentForm.get("Is_Expiry_Available").value) {
      this.attachmentForm
        .get("Expiry_Date")
        .setValidators([Validators.required]);
    } else {
      this.attachmentForm.get("Expiry_Date").clearValidators();
      this.attachmentForm.get("Expiry_Date").setValue("");
    }
  }

  onFileChange(event) {
    let files = event.target.files[0];
    console.log(files);
    if (files) {
      this.fileName = files.name;
      this.selectedFile = <File>files;
      this.isFileUploaded = false;
    }
  }

  submit() {
    this.isFileUploaded = this.selectedFile ? false : true;
    if (this.attachmentForm.valid && !this.isFileUploaded) {
      {
        let attachment = new Attachment();
        attachment = this.attachmentForm.value;
        attachment.Attachment_Id = 0;
        attachment.Form_Id = this.form_Id;
        attachment.File_Name = this.fileName;
        attachment.File_Extension = this.selectedFile.type;
        const formData = new FormData();
        formData.append("file", this.selectedFile, this.selectedFile.name);
        formData.append("AttachmentDetails", JSON.stringify(attachment));

        this.loader = true;
        this._attach.attachFiles(formData).subscribe({
          next: (res) => {
            if (res) {
              this.loader = false;
              this._dialogRef.close(res);
            }
          },
          error: (err) => {
            this.loader = false;
            this._common.openSnackbar(err, snackbarStatus.Danger);
          },
        });
      }
    } else {
      this.attachmentForm.markAllAsTouched();
    }
  }
}
