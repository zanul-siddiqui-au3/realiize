import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minutesToHour'
})

export class MinutesToHourPipe implements PipeTransform {
    transform(value: string) {
        if (value) {
            const hours = Math.round(parseInt(value, 10) / 60);
            const minutes = parseInt(value, 10) % 60;
            return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        } else {
            return `0:00`;
        }
    }
}
