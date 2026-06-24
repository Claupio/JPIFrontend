import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificaEmailPage } from './verifica-email.page';

describe('VerificaEmailPage', () => {
  let component: VerificaEmailPage;
  let fixture: ComponentFixture<VerificaEmailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificaEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
