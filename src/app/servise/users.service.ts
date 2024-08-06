import { Injectable } from '@angular/core';
import { User } from '../types/user.models';
import { UsersApiService } from './users-api-service.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users$ = new BehaviorSubject<User[]>([]);// реактивное состояние
  public readonly users$ = this._users$.asObservable(); //только для чтения

  constructor(private usersApiService: UsersApiService) { }

  //получение массива юзеров
  get users(): User[] {
    return this._users$.getValue();
  }

  //инициализация юзеров
  set users(users: User[]) {
    this._users$.next(users);
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  //удаляем юзеров
  deleteUser(id: number): void {
    this._users$.next(this._users$.value.filter(user => user.id !== id));
  }

  //добавляем юзера
  addUser(userData: User){
    const newUsers = [...this._users$.value, userData];
    this._users$.next(newUsers);
  }

  //изменение юзера
  updateUser(updatedUser: User): void {
    const updatedUsers = this._users$.value.map(user => {
      if (user.id === updatedUser.id) {
        return { ...user, 
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          phone: updatedUser.phone
         };
      }
      return user;
    });
    this.users = updatedUsers;//записываем все измения юзера 
    this._users$.next([...this.users]); // Обновляем список пользователей в Observable
    this.users$.subscribe({});//подписка
  }

}

