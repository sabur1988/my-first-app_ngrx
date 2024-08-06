import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../servise/users.service';
import { User } from '../../types/user.models';


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
  ],
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent {
  //внедряем сервисы через inject
  private usersService = inject(UsersService);

  //создаем свойство, в котором сохраняется инстанс FormBuilder
  //служба Angular Reactive Forms, упрощает создание и управление формами
  private fb = inject(FormBuilder);

  //создаем свойство, в котором будет храниться ссылка на текущий диалоговый компонент.
  private dialogRef = inject(MatDialogRef<AddUserDialogComponent>);

  //создаем свойство users$ которое является Observable (потоком данных) из сервиса UsersService
  public readonly users$ = this.usersService.users$;
  
  form: FormGroup;

  constructor(
    //MAT_DIALOG_DATA — это специальный токен, используемый для передачи данных в диалоговое окно.
    @Inject(MAT_DIALOG_DATA)
    //data полес типом данных User
    public data: User
    ) {
    this.form = this.fb.group({
      name: [this.data?.name, Validators.required],//Validators - делает поле обязательным для заполнения 
      phone: [this.data?.phone, Validators.required],
      email: [this.data?.email, Validators.required],
      username: [this.data?.username, Validators.required],
      website: [this.data?.website],
    });
  }
  //метод сохранения Юзеров
  saveUser(): void {
    //проверяем, является ли форма допустимой (валидной)
    if (this.form.valid) {
      const newUser = this.form.value;//получаем значения, введенные в форму
      newUser.id = Math.round(Math.random() * 100)// генерируем id

      //вызывает метод close() у dialogRef
      //и передает данные нового пользователя. 
      //Эти данные будут возвращены из метода afterClosed() в родительский компонент, 
      //который открыл диалог.
      this.dialogRef.close(newUser);
    }
  }

}
