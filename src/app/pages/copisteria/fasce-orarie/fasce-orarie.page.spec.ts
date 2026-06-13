import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FasceOrariePage } from './fasce-orarie.page';

describe('FasceOrariePage', () => {
  let component: FasceOrariePage;
  let fixture: ComponentFixture<FasceOrariePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FasceOrariePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
