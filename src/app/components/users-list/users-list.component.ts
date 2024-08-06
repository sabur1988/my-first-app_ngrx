import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../servise/users.service';
import { UsersCardComponent } from '../users-card/users-card.component';
import { CommonModule } from '@angular/common';
import { UsersApiService } from '../../servise/users-api-service.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { User } from 'src/app/types/user.models';

import { LocalStargeService } from '../../servise/local-starge.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    UsersCardComponent, 
    CommonModule, 
    AddUserDialogComponent, 
    MatButtonModule, 
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
 
  constructor() { }
  //внедряем сервисы через inject
  private readonly usersService = inject(UsersService)
  private readonly usersApiService = inject(UsersApiService)

  private LocalStargeService = inject(LocalStargeService)

  //инъекции зависимости MatDialog через inject в класс
  private dialog = inject(MatDialog);

  //создаем свойство users$ которое является Observable (потоком данных) из сервиса UsersService
  public readonly users$ = this.usersService.users$;

  dialogOpen = false;
  // user!: User;
  // data!: User;

  // Получаем пользователей с сервера и сохраняем их в сервисе UsersService
  loadUsers() {
    //вызываем функ getUsers() из запроса АПИ в сервисе usersApiService
    this.usersApiService.getUsers()

    .subscribe(// подписывается на Observable 
      //функция обратного вызова, которая выполняется при получении данных
      (users) => this.usersService.users = users
    )
  }

  ngOnInit(): void {

    const isUsers = this.LocalStargeService.getItem('users');

    if(isUsers && isUsers.length > 0) {
      this.usersService.setUsers(isUsers)
    } else {
      this.usersApiService.getUsers().subscribe(
        {
          next: (response: User[]) => {
            this.usersService.setUsers(response);
            this.LocalStargeService.setItem('users', this.usersService.users);
          },
          error: (error) => {
            console.error('ERROR', error);
          }
        }
      )//subscribe
    }// ELSE
  }

  onDeleteUser(id: number): void {
    this.usersService.deleteUser(id);
  }
  //метод добавления Юзера при помощь модального окна
  openAddUserDialog(): void {
    //переменная которая сохраняет ссылку на Модальное окно
    // и запускает в нем Компонент добавления Юзера
    const dialogRef = this.dialog.open(AddUserDialogComponent);
    //подписка на поток после закрытия Модального окна
    dialogRef.afterClosed().subscribe(newUser => {
      //если полученны данные то ...
      if (newUser) {
        //вызывает метод addUser() у UsersService, передавая ему данные нового пользователя. 
        //Это добавляет нового пользователя в список пользователей
        this.usersService.addUser(newUser)
        //подписка на Observable users$
        this.users$.subscribe({})
      }
    });
  }

  //метод измение юзера
  openDialogWithCard(currentUser: User): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: {
        name: currentUser.name,
        phone: currentUser.phone,
        email: currentUser.email,
        username: currentUser.username,
        website: currentUser.website,
      }
    });
    dialogRef.afterClosed().subscribe(editUser => {
      if (editUser) {
        editUser.id = currentUser.id
        this.usersService.updateUser(editUser)
        this.users$.subscribe({})
      }
    });
  }
  
}
