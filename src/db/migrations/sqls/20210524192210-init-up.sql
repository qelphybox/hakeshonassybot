BEGIN TRANSACTION;

CREATE TABLE message_metrics
(
    id              SERIAL PRIMARY KEY,
    tg_id           integer   NOT NULL,
    timestamp       timestamp NOT NULL,
    users_chats_id  integer   NOT NULL,
    photoCount      integer   NOT NULL,
    videoCount      integer   NOT NULL,
    questionCount   integer   NOT NULL,
    stickerSetName  varchar   NOT NULL,
    textLength      integer   NOT NULL,
    voiceCount      integer   NOT NULL,
    lolReplyForUser integer   NOT NULL,
    UNIQUE (tg_id)
);

CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    tg_id      integer NOT NULL,
    first_name varchar NOT NULL,
    last_name  varchar NOT NULL,
    UNIQUE (tg_id)
);

CREATE TABLE chats
(
    id    SERIAL PRIMARY KEY,
    tg_id integer NOT NULL,
    name  varchar NOT NULL,
    UNIQUE (tg_id)

);

CREATE TABLE users_chats
(
    id      SERIAL PRIMARY KEY,
    user_id int REFERENCES users (id),
    chat_id int REFERENCES chats (id),
    UNIQUE (user_id, chat_id)
);


COMMIT;
