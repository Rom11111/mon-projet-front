import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentsDialogComponent } from './view-documents-dialog.component';

describe('ViewDocumentsDialogComponent', () => {
  let component: ViewDocumentsDialogComponent;
  let fixture: ComponentFixture<ViewDocumentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocumentsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
