import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsumatorePage } from './consumatore.page';

describe('ConsumatorePage', () => {
  let component: ConsumatorePage;
  let fixture: ComponentFixture<ConsumatorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumatorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
