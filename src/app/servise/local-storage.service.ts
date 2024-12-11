import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../types/user.models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


  //при загрузке всех пользователей
  setItem(key: string, users:User[]): void{
      localStorage.setItem(key, JSON.stringify(users));
  }
  
  //при добавлении нового пользователя
  addItem(key: string, user: User): User {
    const users = localStorage.getItem(key);
    let usersArray: User[] = [];
  
    if (users) {
      usersArray = JSON.parse(users);
  
      // Найти индекс пользователя с таким же ID
      const userIndex = usersArray.findIndex(existingUser => existingUser.id === user.id);
  
      if (userIndex !== -1) {
        // Если пользователь найден, обновляем его данные
        usersArray[userIndex] = { ...usersArray[userIndex], ...user }; // Слияние данных
      } else {
        // Если пользователь не найден, добавляем как нового
        usersArray.push(user);
      }
    } else {
      // Если данных нет, добавляем нового пользователя
      usersArray.push(user);
    }
  
    // Сохраняем обновленный массив в localStorage
    localStorage.setItem(key, JSON.stringify(usersArray));
  
    console.log("Пользователь добавлен или обновлен:", user);
  
    return user;
  }
  
  //предназначен для получения массива пользователей из localStorage
  getItem(key: string): User[] | null {
    // Получаем данные из localStorage по ключу
      const users = localStorage.getItem(key)
      // проверка 
      if(users){
        return JSON.parse(users);
      } else {
        return null;
      }
  }//getItem

  //удаление юзерa
  removeItem(key: string, userId: number): User[] | null {
    // Получаем данные из localStorage по ключу
    const users = localStorage.getItem(key);

    if (!users) {
        // Если данных нет, возвращаем null
        return null;
    }

    // Преобразуем строку JSON в массив объектов
    let usersArray: User[] = JSON.parse(users);

    // Фильтруем массив, удаляя пользователя с заданным userId
    usersArray = usersArray.filter(user => user.id !== userId);

    // Сохраняем обновлённый массив в localStorage
    localStorage.setItem(key, JSON.stringify(usersArray));

    // Возвращаем обновлённый массив
    return usersArray;
  }//removeItem

  

}
