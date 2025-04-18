import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajamanagerComponent } from './cajamanager.component';

describe('CajamanagerComponent', () => {
  let component: CajamanagerComponent;
  let fixture: ComponentFixture<CajamanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajamanagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajamanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
