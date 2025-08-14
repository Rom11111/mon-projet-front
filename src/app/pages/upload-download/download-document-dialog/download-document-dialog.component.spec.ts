import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDocumentDialogComponent } from './download-document-dialog.component';

describe('DownloadDocumentDialogComponent', () => {
  let component: DownloadDocumentDialogComponent;
  let fixture: ComponentFixture<DownloadDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadDocumentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
