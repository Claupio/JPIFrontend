import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelezionaCopisteriaComponent } from './seleziona-copisteria.component';

describe('SelezionaCopisteriaComponent', () => {
  let component: SelezionaCopisteriaComponent;
  let fixture: ComponentFixture<SelezionaCopisteriaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SelezionaCopisteriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelezionaCopisteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
