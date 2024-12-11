import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { User } from '../../types/user.models';
import { MatButtonModule } from '@angular/material/button';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { LocalStorageService } from 'src/app/servise/local-storage.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users-card',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './users-card.component.html',
  styleUrls: ['./users-card.component.css']
})
export class UsersCardComponent {
  @Input({ required: true }) user!: User;
  @Output() deleteUserEvent = new EventEmitter<number>();
  @Output() editUser = new EventEmitter<User>();

  private dialog = inject(MatDialog);
  private localStorageService = inject(LocalStorageService);

  onDeleteUser(): void {
    this.deleteUserEvent.emit(this.user.id);
  }

  onEditUser(): void {
    this.editUser.emit(this.user);
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: { ...user, isEdit: true }, // Передаем данные пользователя для редактирования
    });

    dialogRef.afterClosed().subscribe((updatedUser: User) => {
      if (updatedUser) {
        const existingUsers = this.localStorageService.getItem('users') || [];
        const updatedUsers = existingUsers.map((u: User) =>
          u.id === updatedUser.id ? updatedUser : u
        );
        this.localStorageService.setItem('users', updatedUsers);
      }
    });
  }
}
