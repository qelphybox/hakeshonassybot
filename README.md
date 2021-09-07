# Hake Shonassy Bot
![](https://github.com/qelphybox/hakeshonassybot/workflows/Checks/badge.svg)

[https://t.me/HakeShonassyBot](https://t.me/HakeShonassyBot
)

Телеграм бот, собирает статистики чата для развлечения, присваивает ачивки участникам.

### Команды
```
/stats
```
![BotStatsGif](botStatsComand.gif)
## Ачивки
- Безработный - больше всего сообщений с пн по пт с 10 до 18 часов по МСК.
- Худший юзер чата - тот скинул больше всего голосовых сообщений за все время
- Поставщик контента - тот кто скинул больше всего фото или видео за все время.
- Стикерпакер - тот кто использовал больше разных стикерпаков в чате, не считая количество стикеров.

## Разработка
Хочешь принять участие в разработке? [Узнай как](CONTRIBUTING.md).  

### Запуск бота для тестов
1) Зарегистрируй себе тестового бота. Напиши [BotFather](https://t.me/botfather) `/start`, затем `/newbot` и следуй инструкциям.
2) BotFather даст тебе токен похожий на этот `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`.
```bash
# 3) Добавь этот токен в переменную `TELEGRAM_BOT_TOKEN` в файле `.env`.
echo "TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" > .env
# 4) Запуск бота.
make dev
# 5) При первом запуске бота необходимо установить зависимости и запустить миграции.
make dev-setup
```
5) Можешь писать своему боту в личку или создать себе тестовую группу и добавить его туда.
6) Чтобы бот правильно работал когда добавлен в группу, ему нужно выключить [Privacy mode](https://core.telegram.org/bots#privacy-mode) это можно сделать в настройках бота у [BotFather](https://t.me/botfather) `@tvoy_bot > Bot settings > Group privacy > Turn off`. В списке юзеров группы, рядом с юзернэймом бота появится `has access to messages`

## Запуск автотестов

```bash
make setup_test
make test
```

## Конфигурация

Пример конфигурации

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=hakeshonassydb
```

## Релиз
Инструкция для мэйнтейнеров
1. Записать свой пароль от [DockerHub](https://hub.docker.com/) в файл `docker_password.txt` в корень проекта
1. Выполнить `make docker-login`
1. Выполнить `make docker-release-latest` (остальные задачи релиза см. [Makefile](Makefile))

## Приватность данных
Бот хранит все сообщения, к которым имеет доступ (Телеграм юзернэйм, имя, фамилия указанные в телеграме, текст и время сообщения, в том числе). Бот реализован в развлекательных и образовательных целях, хранимые данные используются только для составления статистики, тем не менее авторы отказываются от ответственности за сохранность данных. Используйте на свой страх и риск.
