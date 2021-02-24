import {
  Directive,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";

@Directive({
  selector: "[appVolumeControl]",
})
export class VolumeControlDirective {
  @Input("controlType") controlType;

  @Output("volumeUp") volumeEvent = new EventEmitter();

  constructor() {}

  @HostListener("mouseover") onVolumeOver(eventData: Event) {
    if (this.controlType === "show_volume_up") {
      this.volumeEvent.emit();
    }
  }
}
