# PB25-GAMEHUB
Projekt aplikacji zatytułowanej GameHub, wykonany na potrzeby przedmiotu Programowanie aplikacji w języku JavaScript – Pracownia specjalistyczna.

MACIEJ
  - Utworzyłem baze danych
  - Utworzyłem triggery oraz event do obsługi bazy danych
  - Utworzyłem API, które wypisuje z bazy danych nazwy gier oraz ich oceny

KRYSTIAN
  -
  -
  -

JAKUB
W katalogu głównym (PB25-GAMEHUB/):

docker-compose up --build


Backend: http://localhost:3000
UWAGA: URUCHAMIAJ BACKEND DOPIERO PO DOCKERZE npm run dev w katalogu pb25-gamegub/backend

phpMyAdmin: http://localhost:8080

login: root

hasło: root

Jeśli port 3000 jest zajęty, zatrzymaj inny proces Node.js albo zmień port w docker-compose.yml.

 Sprawdzenie bazy danych

Po uruchomieniu:

Wejdź do phpMyAdmin: http://localhost:8080

Powinna istnieć baza gamehub i tabela Game (dzięki podmontowanemu gamehub_db.sql).

Możesz sprawdzić, czy w tabeli są dane.

Frontend

W katalogu pb25-gamehub/frontend uruchom aplikację Vue (np. Vite):

npm install
npm run dev
