import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificaPasswordDaEmailPage } from './modifica-password-da-email.page';

describe('ModificaPasswordDaEmailPage', () => {
  let component: ModificaPasswordDaEmailPage;
  let fixture: ComponentFixture<ModificaPasswordDaEmailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaPasswordDaEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
