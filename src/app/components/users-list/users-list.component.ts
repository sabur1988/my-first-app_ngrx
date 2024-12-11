import { Component, inject, OnInit } from '@angular/core';
//import { UsersService } from '../../servise/users.service'; // Сервис для управления пользователями.
import { UsersCardComponent } from '../users-card/users-card.component'; // Компонент карточки пользователя.
import { CommonModule } from '@angular/common'; // Angular модуль для общих директив, таких как *ngIf и *ngFor.
import { UsersApiService } from '../../servise/users-api-service.service'; // Сервис для взаимодействия с API пользователей.
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component'; // Компонент модального окна для добавления/редактирования пользователей.
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Angular Material модули для работы с модальными окнами.
import { MatButtonModule } from '@angular/material/button'; // Angular Material модуль для кнопок.
import { HeaderComponent } from '../header/header.component'; // Компонент заголовка.
import { FooterComponent } from '../footer/footer.component'; // Компонент нижнего колонтитула.
import { User } from 'src/app/types/user.models'; // Интерфейс данных пользователя.
import { LocalStorageService } from '../../servise/local-storage.service'; // Сервис для работы с localStorage.
import { Store } from '@ngrx/store'; // NgRx Store для управления состоянием.
import { UserActions } from 'src/app/store/users.actions'; // Действия для управления состоянием пользователей в Store.
import { selectUsers, selectUsersFeature } from 'src/app/store/user.selector';

@Component({
  selector: 'app-users-list', // Селектор для использования этого компонента в шаблонах.
  standalone: true, // Указывает, что компонент является автономным и не входит в Angular Module.
  imports: [
    UsersCardComponent, // Компонент для отображения карточки пользователя.
    CommonModule, // Angular CommonModule для директив, таких как *ngIf и *ngFor.
    AddUserDialogComponent, // Компонент модального окна для добавления/редактирования пользователя.
    MatButtonModule, // Angular Material кнопки.
    HeaderComponent, // Компонент заголовка.
    FooterComponent, // Компонент нижнего колонтитула.
    MatDialogModule // Angular Material модальное окно.
  ],
  templateUrl: './users-list.component.html', // Путь к шаблону компонента.
  styleUrls: ['./users-list.component.css'] // Путь к стилям компонента.
})
export class UsersListComponent implements OnInit {
  // Внедрение зависимостей через `inject`.
  //private readonly usersService = inject(UsersService); // Сервис для работы с пользователями.
  private readonly usersApiService = inject(UsersApiService); // Сервис для запросов к API.
  private readonly localStorageService = inject(LocalStorageService); // Сервис для работы с localStorage.
  private readonly store = inject(Store); // NgRx Store для управления состоянием.
  private readonly dialog = inject(MatDialog); // Сервис для работы с модальными окнами.
  public readonly users$ = this.store.select(selectUsers)

  // Observable со списком пользователей, который отслеживает изменения в UsersService.
  //public readonly users$ = this.usersService.users$;

  /**
   * Метод, вызываемый при инициализации компонента.
   * Проверяет, есть ли пользователи в localStorage, иначе загружает их с сервера.
   */
  ngOnInit(): void {
    const isUsers = this.localStorageService.getItem('users'); // Получаем список пользователей из localStorage.
    if (isUsers && isUsers.length > 0) {
      // Если пользователи есть, сохраняем их в сервисе.
      //this.usersService.setUsers(isUsers);
    } else {
      // Если пользователей нет, загружаем их из API.
      this.usersApiService.getUsers().subscribe({
        next: (response: User[]) => {
          //this.usersService.setUsers(response); // Сохраняем в сервисе.
          this.localStorageService.setItem('users', response); // Сохраняем в localStorage.
          this.store.dispatch(UserActions.set({ users: response })); // Отправляем действие в Store для обновления состояния.
        },
        error: (error) => console.error('ERROR', error), // Логируем ошибку, если запрос завершился неудачно.
      });
    }
  }

  /**
   * Метод удаления пользователя.
   * @param id ID пользователя для удаления.
   */
  onDeleteUser(id: number): void {
    //this.usersService.deleteUser(id); // Удаляем пользователя из сервиса.
    const currentUsers = this.localStorageService.getItem('users') || []; // Получаем текущих пользователей из localStorage.
    const updatedUsers = currentUsers.filter((user: User) => user.id !== id); // Фильтруем массив, исключая удалённого пользователя.
    this.localStorageService.setItem('users', updatedUsers); // Обновляем localStorage.
    this.store.dispatch(UserActions.delete({ id })); // Отправляем действие в Store для обновления состояния.
  }

  /**
   * Метод открытия модального окна для добавления нового пользователя.
   */
  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent); // Открываем модальное окно.
    dialogRef.afterClosed().subscribe(newUser => {
      // Выполняем действия после закрытия окна.
      if (newUser) {
        //this.usersService.createUser(newUser); // Добавляем нового пользователя в сервис.
        this.store.dispatch(UserActions.create({ user: newUser })); // Отправляем действие в Store для обновления состояния.
      }
    });
  }

  /**
   * Метод открытия модального окна для редактирования пользователя.
   * @param currentUser Текущий пользователь для редактирования.
   */
  openDialogWithCard(currentUser: User): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: { ...currentUser, isEdit: true }, // Передаём данные пользователя в модальное окно.
    });
    dialogRef.afterClosed().subscribe(editUser => {
      // Выполняем действия после закрытия окна.
      if (editUser) {
        editUser.id = currentUser.id; // Сохраняем оригинальный ID пользователя.
        //this.usersService.editUser(editUser); // Обновляем пользователя в сервисе.
        this.store.dispatch(UserActions.edit({ user: editUser })); // Отправляем действие в Store для обновления состояния.
      }
    });
  }
}
