import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../types/user.models';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users-card',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './users-card.component.html',
  styleUrls: ['./users-card.component.css']
})
export class UsersCardComponent {
  //@Input — это декоратор, указывает что свойство компонента является входным, 
  //т.е. значение этого свойства должно быть передано в компонент извне
  //{required: true} указывает, что это входное свойство является обязательным
  @Input({required: true}) user!: User;

  //@Output — это декоратор указывает, что свойство компонента является выходным событием.
  //Это позволяет компоненту эмитировать (отправлять) события
  @Output() deleteUserEvent = new EventEmitter<number>();

  onDeleteUser(): void {
    this.deleteUserEvent.emit(this.user.id);
  }

}

