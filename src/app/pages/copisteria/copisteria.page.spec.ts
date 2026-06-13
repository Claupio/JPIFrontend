import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopisteriaPage } from './copisteria.page';

describe('CopisteriaPage', () => {
  let component: CopisteriaPage;
  let fixture: ComponentFixture<CopisteriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CopisteriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
