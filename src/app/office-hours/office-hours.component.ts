import { Component } from '@angular/core';

@Component({
  selector: 'app-office-hours',
  templateUrl: './office-hours.component.html',
  styleUrls: ['./office-hours.component.css']
})

export class OfficeHoursComponent {
  objectKeys = Object.keys;
  officeWorkingTime = {
    start: '', end: ''
  };
  officeHours = {
    'Monday': [{ start: '', end: '' }],
    'Tuesday': [{ start: '', end: '' }],
    'Wednesday': [{ start: '', end: '' }],
    'Thursday': [{ start: '', end: '' }],
    'Friday': [{ start: '', end: '' }],
    'Saturday': [{ start: '', end: '' }],
    'Sunday': [{ start: '', end: '' }]
  };


  constructor() {
  }

  addRow(dayOfTheWeek) {
    this.officeHours[dayOfTheWeek].push(this.officeWorkingTime);
  }

  calculateMinutes(actualTime) {
    const minutesArray = actualTime.split(':');
    return `${parseInt(minutesArray[0], 10) * 60 + parseInt(minutesArray[1], 10)}`;
  }

}
