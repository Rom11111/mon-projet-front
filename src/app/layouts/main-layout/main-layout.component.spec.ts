import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAinLayoutComponent } from './main-layout.component';

describe('AdminLayoutComponent', () => {
  let component: MAinLayoutComponent;
  let fixture: ComponentFixture<MAinLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MAinLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MAinLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
