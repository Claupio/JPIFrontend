import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopisteriePage } from './copisterie.page';

describe('CopisteriePage', () => {
  let component: CopisteriePage;
  let fixture: ComponentFixture<CopisteriePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CopisteriePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
