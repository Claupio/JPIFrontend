import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopisteriaFormPage } from './copisteria-form.page';

describe('CopisteriaFormPage', () => {
  let component: CopisteriaFormPage;
  let fixture: ComponentFixture<CopisteriaFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CopisteriaFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
