// import { Injectable } from '@angular/core';
// import { User } from '../types/user.models';
// import { UsersApiService } from './users-api-service.service';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class UsersService {
//   private _users$ = new BehaviorSubject<User[]>([]); // реактивное состояние
//   public readonly users$ = this._users$.asObservable(); // только для чтения

//   constructor(private usersApiService: UsersApiService) {}

//   // Получение массива пользователей
//   get users(): User[] {
//     return this._users$.getValue();
//   }

//   // Установка массива пользователей
//   set users(users: User[]) {
//     this._users$.next(users);
//   }

//   setUsers(users: User[]): void {
//     this.users = users;
//   }

//   // Обновление данных пользователя
//   editUser(editedUser: User): void {
//     const users = this._users$.getValue(); // Получаем текущий массив пользователей
//     const userIndex = users.findIndex(user => user.id === editedUser.id);
  
//     if (userIndex !== -1) {
//       // Если пользователь найден, обновляем его данные
//       users[userIndex] = { ...users[userIndex], ...editedUser };
  
//       // Сохраняем обновлённый массив
//       this.setUsers(users);
//     } else {
//       console.error(`Пользователь с ID ${editedUser.id} не найден`);
//     }
//   }

//   // Добавление пользователя
//   createUser(userData: User): void {
//     const newUsers = [...this._users$.getValue(), userData];
//     this.setUsers(newUsers);
//   }

//   // Удаление пользователя
//   deleteUser(id: number): void {
//     const updatedUsers = this._users$.getValue().filter(user => user.id !== id);
//     this.setUsers(updatedUsers);
//   }
// }

