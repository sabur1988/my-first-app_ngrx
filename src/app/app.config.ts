import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, isDevMode } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

//добавили функ которая предоставляет поддержку анимаций в приложении
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from "@ngrx/store";
import { userReducer } from "./store/user.reducer";
import { provideStoreDevtools } from "@ngrx/store-devtools";


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideStore(
            {
                users: userReducer
            }
        ),
        provideAnimations(),
        provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()}),
    ]
}

