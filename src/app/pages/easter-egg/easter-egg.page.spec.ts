import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EasterEggPage } from './easter-egg.page';

describe('EasterEggPage', () => {
  let component: EasterEggPage;
  let fixture: ComponentFixture<EasterEggPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EasterEggPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
