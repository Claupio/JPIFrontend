import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SegnalazioniPage } from './segnalazioni.page';

describe('SegnalazioniPage', () => {
  let component: SegnalazioniPage;
  let fixture: ComponentFixture<SegnalazioniPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SegnalazioniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
