import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsUploadComponent } from './aws-upload.component';

describe('AwsUploadComponent', () => {
  let component: AwsUploadComponent;
  let fixture: ComponentFixture<AwsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
