# Hake Shonassy Bot

Телеграм бот, собирает статистики чата для разлечения, присваивает ачивки участникам.

### Команды
```
/stats

Сообщений за последние 24 часа: @kirillbobykin (1)
Сообщений за последний час: @kirillbobykin (1)
@kirillbobykin - безработный
```

## Ачивки
- Безработный - больше всего сообщений с пн по пт с 10 до 18 часов по UTC.

## Разработка
Хочешь принять участие в разработке? [Узнай как](CONTRIBUTING.md).  

### Запуск бота для тестов
1) Зарегистрируй себе тестового бота. Напиши [BotFather](https://t.me/botfather) `/start`,затем `/newbot` и следуй инструкциям.
2) BotFather даст тебе токен похожий на этот `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`.
```bash
# 3) Добавь этот токен в переменную `TELEGRAM_BOT_TOKEN` в файле `.env`.
echo "TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" > .env
# 4) Запуск бота.
make dev
```
5) Можешь писать своему боту в личку или создать себе тестовую группу и добавить его туда.

## Запуск автотестов

```bash
make setup_test
make test
```

## Конфгируация

Пример конфигурации

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=hakeshonassydb
```
