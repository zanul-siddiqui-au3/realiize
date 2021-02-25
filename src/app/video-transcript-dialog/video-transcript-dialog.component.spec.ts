import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTranscriptDialogComponent } from './video-transcript-dialog.component';

describe('VideoTranscriptDialogComponent', () => {
  let component: VideoTranscriptDialogComponent;
  let fixture: ComponentFixture<VideoTranscriptDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoTranscriptDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoTranscriptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
