# Hake Shonassy Bot

Телеграм бот, собирает статистики чата для разлечения, присваивает ачивки участникам.

## Разработка

```bash
# set proper token
echo "TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" > .env
make dev
```

## Тесты

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

### Команды
```
/stats

Сообщений за последние 24 часа: @kirillbobykin (1)
Сообщений за последний час: @kirillbobykin (1)
@kirillbobykin - безработный
```

## Ачивки

- Безработный - больше всего сообщений с пн по пт с 10 до 18 часов по UTC.
