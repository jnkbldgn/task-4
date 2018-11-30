[![Build Status](https://travis-ci.org/jnkbldgn/task-4.svg?branch=master)](https://travis-ci.org/jnkbldgn/task-4)
# task-4

Приложение отображает репозиторий ember-truth-helpers.
Есть возможность просмотреть для выбранной ветки коммиты и список файлов,
можно перемещаться по дереву файлов и просматривать их содержимое.

Прод: https://shri-git-task-4-prod.herokuapp.com/

Запуск проверки кода линтерами<br>
<code>npm run lint</code>

Сборка проекта без минификации файлов<br> 
<code>npm run start:dev</code>

Сборка проекта с мнификацией файлов<br> 
<code>npm run start</code>

Создание build<br>
<code>npm run build</code>

Запуск unit тестов<br> 
<code>npm run test</code>

Перед запуском интеграционных тестов, следует установить selenium<br> 
<code>selenium-standalone --global</code><br> 
<code>selenium-standalone install</code><br> 
Далее в отдельной вкладке терминала запустить selenium<br> 
<code>selenium-standalone start</code><br> 
После запустить проект, например:<br> 
<code>npm run start:dev</code><br> 
Запуск интеграционных тестов<br> 
<code>npm run test:i</code><br> 

Для сборки используется gulp

Настроена сборка Docker-контейнера.
Реализованы следующие моменты:
- Пользователь создаёт пулл-реквест или делает коммит в master ветку на GitHub.
- Travis запускает проверки для пулл-реквеста, выполняя следующие действия:
    - Проверка кода (линтеры, тесты)
    - Сборка проекта
    - Поднятие стенда в Heroku на основе Docker-контейнера в review-режиме (pipeline)
- Travis запускает проверки для master-ветки, выполняя следующие действия:
    - Проверка кода (линтеры, тесты)
    - Сборка проекта
    - Поднятие стенда в Heroku на основе Docker-контейнера в staging-режиме (pipeline)
    
При выставлении тега происходит деплой приложения в Heroku, в production окружение.
