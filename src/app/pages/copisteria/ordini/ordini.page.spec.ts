import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopisteriaOrdiniPage } from './ordini.page';

describe('CopisteriaOrdiniPage', () => {
  let component: CopisteriaOrdiniPage;
  let fixture: ComponentFixture<CopisteriaOrdiniPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CopisteriaOrdiniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
