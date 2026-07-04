import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchivioStatistichePage } from './statistiche.page';

describe('ArchivioStatistichePage', () => {
  let component: ArchivioStatistichePage;
  let fixture: ComponentFixture<ArchivioStatistichePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivioStatistichePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
