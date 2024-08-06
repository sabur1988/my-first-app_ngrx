import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../types/user.models';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStargeService {

  // // Создаем BehaviorSubject для хранения данных
  // private dataSource = new BehaviorSubject<any>(null);
  // public data$ = this.dataSource.asObservable();

  // // constructor() {}

  // // Метод для сохранения данных в localStorage
  // saveData(data: any) {
  //   localStorage.setItem('users', JSON.stringify(data));
  //   // Обновляем источник данных
  //   this.dataSource.next(data);
  // }

  // getItem(): string | null {
  //   return localStorage.getItem('users') || null;
  // }
  
  // // Метод для получения данных из localStorage
  // loadData(): Observable<any> {
  //   const storedData = localStorage.getItem('users');
  //   if (storedData) {
  //     // Преобразуем строку обратно в объект
  //     const parsedData = JSON.parse(storedData);
  //     // Возвращаем Observable с данными
  //     return of(parsedData);
  //   } else {
  //     // Если данных нет, возвращаем Observable с null
  //     return of(null);
  //   }
  // }



  constructor(@Inject(PLATFORM_ID) private platormId: Object) { }


  setItem(key: string, users:User[]): void{
    if(isPlatformBrowser(this.platormId)){
      localStorage.setItem(key, JSON.stringify(users));
    }
  }


  getItem(key: string): User[] | null {
    if(isPlatformBrowser(this.platormId)){
      const users = localStorage.getItem(key)

      if(users){
        return JSON.parse(users);
      } else {
        return null;
      }

    } else {
        return null;
    }
  }
}
