# Hake Shonassy Bot

Bot gives achieves for telegram groups users

## Dev

```bash
# set proper token
echo "TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" > .env
make dev
```

## Dependencies

- node v13.8.0
- mongodb 4.2.3

## Configuration

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=hakeshonassydb
```

## Mechanism
- ReceiveMessage from telegram API
- Store messages -> Analyze storage
- Send achieve statistics by command

### Commands

STILL NOT IMPLEMENTED!

/stat ->
User1: Most posts per day

## Achieves

- Most posts per day
