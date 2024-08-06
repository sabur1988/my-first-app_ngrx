import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

//добавили функ которая предоставляет поддержку анимаций в приложении
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),

        provideAnimations(),
    ]
}

