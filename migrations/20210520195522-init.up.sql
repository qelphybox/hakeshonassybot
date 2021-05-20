BEGIN TRANSACTION;

-- message_metrics
-- -------
-- id:serial
-- tg_id:int
-- timestamp:datetime
-- users_chats_id:int
-- photoCount:int
-- videoCount:int
-- questionCount: int
-- stickerSetName:string
-- textLength:int
-- voiceCount:int
-- lolReplyForUser:int

CREATE TABLE message_metrics
(
    id              SERIAL PRIMARY KEY,
    tg_id           integer     NOT NULL,
    timestamp       timestamp   NOT NULL,
    users_chats_id  integer     NOT NULL,
    photoCount      integer     NOT NULL,
    videoCount      integer     NOT NULL,
    questionCount   integer     NOT NULL,
    stickerSetName  varchar(40) NOT NULL,
    textLength      integer     NOT NULL,
    voiceCount      integer     NOT NULL,
    lolReplyForUser integer     NOT NULL
);

CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    tg_id      integer     NOT NULL,
    first_name varchar(40) NOT NULL,
    last_name  varchar(40) NOT NULL
);

CREATE TABLE chats
(
    id     SERIAL PRIMARY KEY,
    tg_id  integer     NOT NULL,
    string varchar(40) NOT NULL
);

CREATE TABLE users_chats
(
    user_id int REFERENCES users (id),
    chat_id int REFERENCES chats (id),
    CONSTRAINT user_chat_pkey PRIMARY KEY (user_id, chat_id) -- explicit pk
);


COMMIT;
