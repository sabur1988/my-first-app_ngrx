import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { UsersService } from '../../servise/users.service';
import { User, UserDialogData } from '../../types/user.models';
import { LocalStorageService } from '../../servise/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule, // Для работы с модулями
  ],
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css'],
})
export class AddUserDialogComponent {
  private fb = inject(FormBuilder); // Формы
  private dialogRef = inject(MatDialogRef<AddUserDialogComponent>); // Диалоговое окно
  private localStorageService = inject(LocalStorageService); // LocalStorage
  //private usersService = inject(UsersService);

  form: FormGroup; // Форма
  isEdit: boolean; // Флаг редактирования

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData // Используем расширенный интерфейс
  ) {
    // Проверка на редактирование и корректная установка значений
    this.isEdit = this.data?.isEdit || false; // Проверка флага редактирования
  
    // Инициализация формы
    this.form = this.fb.group({
      id: [this.data?.id || null], // ID пользователя (если это редактирование, ID будет передано)
      name: [this.data?.name || '', Validators.required],
      phone: [this.data?.phone || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      username: [this.data?.username || '', Validators.required],
      website: [this.data?.website || ''],
    });
  
    console.log('isEdit:', this.isEdit);  // Для дебага
    console.log('form data:', this.data); // Проверка данных, полученных через MAT_DIALOG_DATA
  }
  
  

  /**
   * Сохранение данных пользователя
   */
  saveUser(): void {
    if (this.form.valid) {
      const user = this.form.value; // Данные из формы
      const existingUsers: User[] = this.localStorageService.getItem('users') || [];
  
      if (this.isEdit && this.data.id) {
        // Обновление существующего пользователя
        const updatedUsers = existingUsers.map((u: User) =>
          u.id === this.data.id ? { ...u, ...user, id: this.data.id } : u
        );
        
        // Обновление списка пользователей в localStorage
        this.localStorageService.setItem('users', updatedUsers);
        
        // Закрытие диалога с обновленными данными
        this.dialogRef.close({ ...user, id: this.data.id }); 
      } else {
        // Добавление нового пользователя
        const maxId = existingUsers.length > 0
          ? Math.max(...existingUsers.map((u: User) => u.id))
          : 0;
        const newUser = { ...user, id: maxId + 1 };
  
        // Добавление нового пользователя в список
        existingUsers.push(newUser);
        this.localStorageService.setItem('users', existingUsers);
        
        // Закрытие диалога с новыми данными
        this.dialogRef.close(newUser);
      }
    }
  }
  

  /**
   * Отмена: закрытие диалогового окна без сохранения
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}

