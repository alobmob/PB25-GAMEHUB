-- ============================
-- GameHub Database (MySQL) - pełna wersja z UTF-8
-- ============================

CREATE DATABASE IF NOT EXISTS gamehub
CHARACTER SET utf8mb4
COLLATE utf8mb4_polish_ci;

USE gamehub;

-- 1. Tabela users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

INSERT INTO users (email, password_hash, display_name, role, created_at) VALUES
('jan.kowalski@example.com', '$2b$10$hash1', 'Jan Kowalski', 'user', '2023-01-15'),
('anna.nowak@example.com', '$2b$10$hash2', 'Anna Nowak', 'user', '2023-02-20'),
('admin@gamehub.pl', '$2b$10$hash3', 'Administrator', 'admin', '2022-12-01'),
('piotr.wisniewski@example.com', '$2b$10$hash4', 'Piotr Wiśniewski', 'user', '2023-03-10');

-- 2. Tabela games
CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  release_year INT,
  cover_image VARCHAR(500),
  popularity_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

INSERT INTO games (title, slug, description, release_year, cover_image, popularity_score) VALUES
('Cyberpunk 2077', 'cyberpunk-2077', 'Futurystyczna gra RPG osadzona w Night City, mieście obsesji na punkcie władzy, luksusu i modyfikacji ciała.', 2020, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=600&fit=crop', 95),
('The Witcher 3: Wild Hunt', 'the-witcher-3', 'Epicka gra RPG opowiadająca historię Geralta z Rivii, łowcy potworów poszukującego swojej przybranej córki.', 2015, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop', 98),
('Elden Ring', 'elden-ring', 'Mroczna gra fantasy stworzona przez FromSoftware we współpracy z George/em R.R. Martinem.', 2022, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop', 94),
('Minecraft', 'minecraft', 'Kultowa gra sandbox pozwalająca budować, eksplorować i przetrwać w proceduralnie generowanym świecie.', 2011, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=600&fit=crop', 99),
('God of War Ragnarök', 'god-of-war-ragnarok', 'Kontynuacja przygód Kratosa i Atreusa w nordyckim świecie pełnym bogów i potworów.', 2022, 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=600&fit=crop', 92),
('Red Dead Redemption 2', 'red-dead-redemption-2', 'Epicka opowieść o outlawach na Dzikim Zachodzie u schyłku XIX wieku.', 2018, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=600&fit=crop', 96),
('Hollow Knight', 'hollow-knight', 'Klimatyczna gra metroidvania z ręcznie rysowaną grafiką i wymagającą rozgrywką.', 2017, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop', 88),
('Hades', 'hades', 'Roguelike dungeon crawler osadzony w greckiej mitologii, tworzony przez Supergiant Games.', 2020, 'https://images.unsplash.com/photo-1518157449206-6c183e6a2c5c?w=400&h=600&fit=crop', 91),
('Stardew Valley', 'stardew-valley', 'Relaksująca gra symulacyjna o prowadzeniu farmy i życiu na wsi.', 2016, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=600&fit=crop', 93),
('Baldur\s Gate 3', 'baldurs-gate-3', 'Epickie RPG oparte na systemie Dungeons & Dragons 5E, stworzone przez Larian Studios.', 2023, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop', 97),
('Celeste', 'celeste', 'Platformówka z głęboką narracją o pokonywaniu własnych słabości.', 2018, 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=600&fit=crop', 86),
('The Legend of Zelda: Breath of the Wild', 'zelda-breath-of-the-wild', 'Rewolucyjna gra z otwartym światem osadzona w uniwersum Zeldy.', 2017, 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop', 97);

-- 3. Tabela tags (gatunki + platformy)
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

INSERT INTO tags (name) VALUES
('RPG'),('Akcja'),('Przygodowa'),('Strategiczna'),('Symulacyjna'),('Platformowa'),
('Indie'),('Sandbox'),('Survivalowa'),('Hack and Slash'),('Western'),('Souls-like'),
('Eksploracjna'),('PC'),('PlayStation 5'),('PlayStation 4'),('Xbox Series X'),
('Xbox One'),('Nintendo Switch'),('Mobile');

-- 4. Tabela game_tags (many-to-many)
CREATE TABLE game_tags (
  game_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (game_id, tag_id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- Przypisanie tagów (przykładowe)
INSERT INTO game_tags (game_id, tag_id) VALUES
(1,1),(1,2),(1,3),(1,14),(1,15),(1,17),
(2,1),(2,3),(2,4),(2,14),(2,16),(2,18),(2,19),
(3,1),(3,2),(3,12),(3,14),(3,15),(3,17),
(4,8),(4,9),(4,14),(4,15),(4,17),(4,18),(4,20);

-- 5. Tabela ratings
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  score INT CHECK(score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

INSERT INTO ratings (user_id, game_id, score, comment, created_at) VALUES
(1,1,4,'Świetna gra, choć miała trudny start. Po łatkach jest naprawdę doskonała!', '2024-03-15'),
(2,1,5,'Night City to niesamowite miejsce. Jestem zachwycona klimatem i fabułą.', '2024-03-14'),
(3,2,5,'Najlepsza gra RPG w jakią grałem. Wiedźmin 3 to arcydzieło!', '2024-03-12');

-- 6. Tabela user_lists
CREATE TABLE user_lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

INSERT INTO user_lists (user_id, name, is_public) VALUES
(1, 'Do ogrania', TRUE),
(1, 'Ulubione', FALSE);

-- 7. Tabela user_list_items
CREATE TABLE user_list_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  list_id INT NOT NULL,
  game_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (list_id) REFERENCES user_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

INSERT INTO user_list_items (list_id, game_id) VALUES
(1,3),(1,8),(1,10),
(2,2),(2,4),(2,9);
