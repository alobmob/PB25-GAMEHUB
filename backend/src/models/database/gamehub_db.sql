-- upewnij się, że używasz bazy i uprawnień
-- CREATE DATABASE gamehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE gamehub;

CREATE TABLE `AccountType` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `account_type` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50),
  `surname` VARCHAR(50),
  `nick` VARCHAR(50),
  `email` VARCHAR(255),
  `password` VARCHAR(255),
  `account_type_id` INT,
  INDEX (`account_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `GameProducer` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `GameType` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Game` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `producer_id` INT,
  `type_id` INT,
  `release_date` DATE,
  `points` DOUBLE,
  `total_votes` INT,
  `total_points` INT,
  INDEX (`producer_id`),
  INDEX (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO Game (title, producer_id, type_id, release_date, points, total_votes, total_points)
VALUES
('Cyberpunk 2077', 1, 1, '2020-12-10', 7.5, 100, 750),
('The Witcher 3', 1, 1, '2015-05-19', 9.0, 200, 1800),
('Elden Ring', 2, 2, '2022-02-25', 9.5, 150, 1425),
('Hades', 3, 3, '2020-09-17', 8.8, 120, 1056),
('God of War', 4, 2, '2018-04-20', 9.2, 180, 1656);

CREATE TABLE `PointValue` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `label` VARCHAR(50),
  `value` INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `point_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `game_id` INT,
  `point_value_id` INT,
  `date` DATE,
  INDEX (`user_id`),
  INDEX (`game_id`),
  INDEX (`point_value_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `event` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `event_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `game_id` INT,
  `event_id` INT,
  `date` DATE,
  INDEX (`user_id`),
  INDEX (`game_id`),
  INDEX (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Klucze obce
ALTER TABLE `Users`
  ADD CONSTRAINT fk_users_account_type
  FOREIGN KEY (`account_type_id`) REFERENCES `AccountType`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Game`
  ADD CONSTRAINT fk_game_producer
  FOREIGN KEY (`producer_id`) REFERENCES `GameProducer`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT fk_game_type
  FOREIGN KEY (`type_id`) REFERENCES `GameType`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `point_log`
  ADD CONSTRAINT fk_pointlog_user
  FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_pointlog_game
  FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_pointlog_pointvalue
  FOREIGN KEY (`point_value_id`) REFERENCES `PointValue`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `event_log`
  ADD CONSTRAINT fk_eventlog_user
  FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_eventlog_game
  FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_eventlog_event
  FOREIGN KEY (`event_id`) REFERENCES `event`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
