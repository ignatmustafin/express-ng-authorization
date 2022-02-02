import {Component, OnInit} from '@angular/core';
import {OverlayContainer} from "@angular/cdk/overlay";
import {Observable} from "rxjs";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  private overlayContainer!: OverlayContainer;
  public theme = 'light';
  public isDarkTheme!: Observable<boolean>;

  constructor() {
  }

  ngOnInit(): void {
  }

}
