// Импортируем функции и интерфейсы, необходимые для работы с NgRx Store
import { createActionGroup, props } from '@ngrx/store';
import { User } from '../types/user.models'; // Интерфейс User описывает структуру объекта пользователя

// Создаем группу действий (actions), связанных с управлением пользователями
export const UserActions = createActionGroup({
    // Указываем источник действий (source). Это имя используется для логического объединения действий.
    source: 'User',

    // Определяем события (actions), которые могут быть вызваны.
    events: {
        // Действие 'set': используется для установки (замены) списка пользователей.
        // Принимает параметр `users`, который является массивом объектов типа User.
        'set': props<{ users: User[] }>(), 

        // Действие 'edit': используется для редактирования существующего пользователя.
        // Принимает параметр `user`, который содержит обновленный объект пользователя.
        'edit': props<{ user: User }>(),   

        // Действие 'create': используется для добавления нового пользователя.
        // Принимает параметр `user`, представляющий нового пользователя.
        'create': props<{ user: User }>(), 

        // Действие 'delete': используется для удаления пользователя.
        // Принимает параметр `id`, представляющий идентификатор удаляемого пользователя.
        'delete': props<{ id: number }>(), 
    },
});
