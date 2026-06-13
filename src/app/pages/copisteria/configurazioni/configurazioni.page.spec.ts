import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurazioniPage } from './configurazioni.page';

describe('ConfigurazioniPage', () => {
  let component: ConfigurazioniPage;
  let fixture: ComponentFixture<ConfigurazioniPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurazioniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
