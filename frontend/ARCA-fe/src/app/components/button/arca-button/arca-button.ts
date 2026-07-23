import {Component, computed, input, output} from '@angular/core';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'delete' | 'confirm';

@Component({
  selector: 'app-arca-button',
  imports: [],
  templateUrl: './arca-button.html',
  styleUrl: './arca-button.scss',
})
export class ArcaButton {
  public type = input.required<ButtonType>()
  public disabled = input<boolean>()
  public onClick = output()

  public handleClick = () => {
    this.onClick.emit()
  }

  protected style = computed(() => 'arca-button ' + this.type())

}
