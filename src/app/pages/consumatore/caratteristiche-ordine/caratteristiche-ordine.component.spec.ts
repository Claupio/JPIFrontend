import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaratteristicheOrdineComponent } from './caratteristiche-ordine.component';

describe('CaratteristicheOrdineComponent', () => {
  let component: CaratteristicheOrdineComponent;
  let fixture: ComponentFixture<CaratteristicheOrdineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CaratteristicheOrdineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaratteristicheOrdineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
