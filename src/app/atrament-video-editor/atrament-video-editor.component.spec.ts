import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtramentVideoEditorComponent } from './atrament-video-editor.component';

describe('AtramentVideoEditorComponent', () => {
  let component: AtramentVideoEditorComponent;
  let fixture: ComponentFixture<AtramentVideoEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtramentVideoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtramentVideoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
