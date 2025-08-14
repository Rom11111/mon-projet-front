import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeReportStatusComponent } from './change-report-status.component';

describe('ChangeReportStatusComponent', () => {
  let component: ChangeReportStatusComponent;
  let fixture: ComponentFixture<ChangeReportStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeReportStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
