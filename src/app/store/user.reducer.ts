import { createReducer, on } from "@ngrx/store";
// Импорт функций `createReducer` и `on` из библиотеки NgRx Store.
// `createReducer` используется для создания редьюсера, который обрабатывает изменения состояния.
// `on` используется для определения обработчиков действий.

import { UserActions } from "./users.actions";
// Импорт объекта `UserActions`, содержащего набор определённых действий (actions) для управления пользователями.

import { User } from "../types/user.models";
// Импорт интерфейса `User`, который описывает структуру данных пользователя.

// Проверяем, есть ли данные в LocalStorage.
const localStorageUsers = JSON.parse(localStorage.getItem('users') || 'null');


//const initialState: { users: User[] } = { users: [] };
// Инициализация начального состояния. 
// `users` — это массив, который изначально пуст. 
// Начальное состояние задаётся при запуске приложения.
const initialState: { users: User[] } = {
    users: localStorageUsers || [], // Если в LocalStorage есть данные, берём их, иначе массив пустой.
};



export const userReducer = createReducer(
    // Создание редьюсера `userReducer`. 
    // Он управляет состоянием пользователей, обрабатывая действия (actions) и возвращая новое состояние.

    initialState,
    // Первым аргументом передаётся начальное состояние `initialState`.

    on(UserActions.set, (state, payload) => ({
    // Обработчик действия `set`. Когда это действие вызывается, выполняется переданная функция.
    // `state` — текущее состояние.
    // `payload` — данные, переданные с этим действием.

        ...state,
        // Создаётся копия текущего состояния (`state`) с помощью оператора расширения (`...`).

        users: payload.users
        // Обновляется поле `users`, заменяя его массивом пользователей из `payload`.
    })),

    on(UserActions.edit, (state, payload) => ({
    // Обработчик действия `edit`. Обновляет существующего пользователя в массиве.

        ...state,
        // Создаётся копия текущего состояния.

        users: state.users.map((user) => {
        // Обновляем массив пользователей с помощью `map`.
        // Для каждого пользователя проверяем, совпадает ли его `id` с `id` из переданного `payload.user`.

            if (user.id === payload.user.id) {
                return payload.user;
                // Если `id` совпадают, заменяем текущего пользователя обновлённым из `payload.user`.
            } else {
                return user;
                // Если `id` не совпадают, возвращаем текущего пользователя без изменений.
            }
        })
    })),

    on(UserActions.create, (state, payload) => ({
    // Обработчик действия `create`. Добавляет нового пользователя в массив.

        ...state,
        // Создаём копию текущего состояния.

        users: [...state.users, payload.user]
        // Добавляем нового пользователя (`payload.user`) в конец массива `users`.
    })),

    on(UserActions.delete, (state, payload) => ({
    // Обработчик действия `delete`. Удаляет пользователя из массива.

        ...state,
        // Создаём копию текущего состояния.

        users: state.users.filter((user) => user.id !== payload.id)
        // Создаём новый массив, фильтруя пользователей.
        // Удаляем пользователя, `id` которого совпадает с `payload.id`.
    })),
);