import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalVideoEditorComponent } from './local-video-editor.component';

describe('LocalVideoEditorComponent', () => {
  let component: LocalVideoEditorComponent;
  let fixture: ComponentFixture<LocalVideoEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalVideoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalVideoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
