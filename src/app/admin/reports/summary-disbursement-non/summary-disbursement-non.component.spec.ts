import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDisbursementNonComponent } from './summary-disbursement-non.component';

describe('SummaryDisbursementNonComponent', () => {
  let component: SummaryDisbursementNonComponent;
  let fixture: ComponentFixture<SummaryDisbursementNonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryDisbursementNonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryDisbursementNonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
