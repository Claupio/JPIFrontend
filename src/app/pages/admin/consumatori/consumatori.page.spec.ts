import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsumatoriPage } from './consumatori.page';

describe('ConsumatoriPage', () => {
  let component: ConsumatoriPage;
  let fixture: ComponentFixture<ConsumatoriPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumatoriPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
