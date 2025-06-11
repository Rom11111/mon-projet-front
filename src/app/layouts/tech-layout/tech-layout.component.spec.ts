import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechLayoutComponent } from './tech-layout.component';

describe('TechLayoutComponent', () => {
  let component: TechLayoutComponent;
  let fixture: ComponentFixture<TechLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
