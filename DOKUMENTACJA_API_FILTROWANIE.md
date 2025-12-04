# Backend: Rozwinięcie API o Filtrowanie, Sortowanie i Paginację

## Przegląd

API `/api/games` zostało rozszerzone o zaawansowane opcje filtrowania, sortowania i paginacji. Użytkownik może teraz:
- Filtrować gry po gatunkach i platformach (wiele wyborów)
- Filtrować po roku wydania
- Sortować wyniki
- Paginować rezultaty

---

## Endpoint: GET /api/games

### Parametry Query

| Parametr | Typ | Opcjonalny | Opis |
|----------|-----|-----------|------|
| `genre` | string[] | Tak | Filtruj po gatunkach. Może być powtarzany. Np: `?genre=RPG&genre=Akcja` |
| `platform` | string[] | Tak | Filtruj po platformach. Może być powtarzany. Np: `?platform=PC&platform=PS5` |
| `year` | string | Tak | Filtruj po roku wydania. Np: `?year=2023` |
| `sort` | string | Tak | Sortowanie wyników. Domyślnie: `popularity` |
| `page` | number | Tak | Numer strony (domyślnie: 1). Musi być ≥ 1 |
| `limit` | number | Tak | Liczba elementów na stronę (domyślnie: 9) |

### Opcje Sortowania

- **`popularity`** (domyślnie) - Sortuje malejąco po `popularity_score`
- **`rating`** - Sortuje malejąco po średniej ocenie gier
- **`year-desc`** - Sortuje malejąco po roku wydania (najnowsze)
- **`year-asc`** - Sortuje rosnąco po roku wydania (najstarsze)

### Dostępne Gatunki

```
RPG, Akcja, Przygodowa, Strategiczna, Symulacyjna, Platformowa, 
Indie, Sandbox, Survivalowa, Hack and Slash, Western, Souls-like, Eksploracjna
```

### Dostępne Platformy

```
PC, PlayStation 5, PlayStation 4, Xbox Series X, Xbox One, Nintendo Switch, Mobile
```

---

## Przykłady Zapytań

### 1. Pobranie Wszystkich Gier (Domyślne Sortowanie)
```
GET /api/games
```

**Odpowiedź:**
```json
{
  "games": [
    {
      "id": 1,
      "title": "The Witcher 3",
      "slug": "the-witcher-3",
      "description": "...",
      "releaseYear": 2015,
      "coverImage": "...",
      "coverUrl": "...",
      "averageRating": 4.8,
      "ratingsCount": 42,
      "popularityScore": 95,
      "ratings": [...],
      "tags": ["RPG", "Akcja", "PC", "PlayStation 5"],
      "genres": ["RPG", "Akcja"],
      "platforms": ["PC", "PlayStation 5"]
    },
    ...
  ],
  "total": 12
}
```

### 2. Filtrowanie po Jednym Gatunku
```
GET /api/games?genre=RPG
```
Zwraca wszystkie gry z gatunkiem RPG (9 na stronę).

### 3. Filtrowanie po Wielu Gatunkach (OR)
```
GET /api/games?genre=RPG&genre=Akcja
```
Zwraca gry, które mają **albo** RPG **albo** Akcję (lub oba).

### 4. Filtrowanie po Gatunku i Platformie (AND)
```
GET /api/games?genre=RPG&platform=PC
```
Zwraca gry, które mają **zarówno** gatunek RPG **i** platformę PC.

### 5. Filtrowanie po Roku
```
GET /api/games?year=2023
```
Zwraca gry wydane w roku 2023.

### 6. Sortowanie po Ocenie
```
GET /api/games?sort=rating
```
Sortuje gry od najwyżej ocenionych.

### 7. Sortowanie po Roku (Najnowsze)
```
GET /api/games?sort=year-desc
```

### 8. Paginacja (Strona 2)
```
GET /api/games?page=2&limit=9
```
Zwraca gry 10-18 (przy domyślnym limicie 9 na stronę).

### 9. Kombinacja Filtrów
```
GET /api/games?genre=RPG&platform=PC&year=2023&sort=rating&page=1&limit=12
```
- Filtruje po: RPG na PC z roku 2023
- Sortuje po ocenie
- Zwraca stronę 1 z 12 elementami na stronę

---

## Struktura Odpowiedzi

### Sukces (200 OK)
```json
{
  "games": [
    {
      "id": number,
      "title": string,
      "slug": string,
      "description": string,
      "releaseYear": number,
      "coverImage": string,
      "coverUrl": string,
      "averageRating": number,       // Średnia ocena z komentarzy
      "ratingsCount": number,        // Liczba komentarzy/ocen
      "popularityScore": number,     // Wynik popularności
      "ratings": array,              // Tablica ocen z komentarzami
      "tags": string[],              // Wszystkie tagi
      "genres": string[],            // Filtrowane tylko gatunki
      "platforms": string[]          // Filtrowane tylko platformy
    }
  ],
  "total": number                    // Całkowita liczba gier spełniających filtry
}
```

### Błąd (500)
```json
{
  "error": "Wiadomość o błędzie"
}
```

---

## Logika Filtrowania

### Gatunki i Platformy
```
WHERE EXISTS (
  SELECT 1 FROM game_tags gt2
  LEFT JOIN tags t2 ON gt2.tag_id = t2.id
  WHERE gt2.game_id = g.id AND t2.name IN (wybrany_gatunek_1, wybrany_gatunek_2, ...)
) 
AND EXISTS (
  SELECT 1 FROM game_tags gt3
  LEFT JOIN tags t3 ON gt3.tag_id = t3.id
  WHERE gt3.game_id = g.id AND t3.name IN (wybrana_platforma_1, wybrana_platforma_2, ...)
)
```

- **Wiele gatunków** = **OR** (gra musi mieć co najmniej jeden z wybranych)
- **Wiele platform** = **OR** (gra musi mieć co najmniej jedną z wybranych)
- **Gatunek + Platform** = **AND** (gra musi spełniać oba warunki)

### Rok
Gra musi mieć dokładnie wybrany rok: `g.release_year = ?`

---

## Implementacja Frontend

### Vue.js (Home.vue)

```javascript
const fetchGames = async () => {
  try {
    const params = new URLSearchParams();

    // Filtrowanie - wszystkie zaznaczenia
    selectedGenres.value.forEach(genre => params.append('genre', genre));
    selectedPlatforms.value.forEach(platform => params.append('platform', platform));
    if (selectedYear.value !== 'Wszystkie') params.append('year', selectedYear.value);

    // Sortowanie
    if (sortBy.value) params.append('sort', sortBy.value);

    // Paginacja
    params.append('page', currentPage.value);
    params.append('limit', itemsPerPage.value);

    const res = await fetch(`http://localhost:3000/api/games?${params.toString()}`);
    const response = await res.json();

    allGames.value = response.games;
    totalGamesCount.value = response.total;
  } catch (err) {
    console.error('Błąd pobierania gier:', err);
  }
};
```

---

## Implementacja Backend

### Controller (gamesController.js)

```javascript
export const getAllGames = async (req, res) => {
  try {
    const { genre, platform, year, sort, page = 1, limit = 9 } = req.query;

    // Normalizuj na tablice (mogą być stringiem lub tablicą)
    const genres = Array.isArray(genre) ? genre : (genre ? [genre] : []);
    const platforms = Array.isArray(platform) ? platform : (platform ? [platform] : []);

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 9;
    const offset = (pageNum - 1) * limitNum;

    // Pobierz gry z filtrowaniem
    const { games, total } = await getAllGamesQuery({ 
      genres, 
      platforms, 
      year, 
      sort, 
      limit: limitNum, 
      offset 
    });

    // Przetworzenie danych...
    res.json({ games: result, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
```

### Model Query (query.js)

```javascript
export const getAllGamesQuery = async ({ genres, platforms, year, sort, limit, offset }) => {
  const params = [];
  let whereClauses = [];

  // Filtrowanie po roku
  if (year) {
    whereClauses.push('g.release_year = ?');
    params.push(year);
  }

  // Filtrowanie po gatunkach
  if (genres.length > 0) {
    const genrePlaceholders = genres.map(() => '?').join(',');
    whereClauses.push(`EXISTS (
      SELECT 1 FROM game_tags gt2
      LEFT JOIN tags t2 ON gt2.tag_id = t2.id
      WHERE gt2.game_id = g.id AND t2.name IN (${genrePlaceholders})
    )`);
    params.push(...genres);
  }

  // Filtrowanie po platformach
  if (platforms.length > 0) {
    const platformPlaceholders = platforms.map(() => '?').join(',');
    whereClauses.push(`EXISTS (
      SELECT 1 FROM game_tags gt3
      LEFT JOIN tags t3 ON gt3.tag_id = t3.id
      WHERE gt3.game_id = g.id AND t3.name IN (${platformPlaceholders})
    )`);
    params.push(...platforms);
  }

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Pobierz całkowitą liczbę (dla paginacji)
  const [totalResult] = await pool.query(`
    SELECT COUNT(DISTINCT g.id) as count
    FROM games g
    LEFT JOIN ratings r ON g.id = r.game_id
    ${whereSQL}
  `, params);

  // Pobierz dane z limitem i offsetem
  const [games] = await pool.query(`
    SELECT ...
    FROM games g
    LEFT JOIN game_tags gt ON g.id = gt.game_id
    LEFT JOIN tags t ON gt.tag_id = t.id
    LEFT JOIN ratings r ON g.id = r.game_id
    ${whereSQL}
    GROUP BY g.id
    ORDER BY ...
    LIMIT ? OFFSET ?;
  `, [...params, limit, offset]);

  return { games, total: totalResult[0].count };
};
```

---

## Testy

### Test 1: Wszystkie gry
```bash
curl "http://localhost:3000/api/games"
```
**Oczekiwanie:** Zwraca wszystkie gry, pierwsze 9 na stronie

### Test 2: Filtrowanie po RPG
```bash
curl "http://localhost:3000/api/games?genre=RPG"
```
**Oczekiwanie:** Tylko gry z tagiem RPG

### Test 3: RPG i PC
```bash
curl "http://localhost:3000/api/games?genre=RPG&platform=PC"
```
**Oczekiwanie:** Gry mające zarówno tag RPG i PC

### Test 4: Strona 2
```bash
curl "http://localhost:3000/api/games?page=2&limit=9"
```
**Oczekiwanie:** Gry 10-18

### Test 5: Sortowanie po ocenie
```bash
curl "http://localhost:3000/api/games?sort=rating"
```
**Oczekiwanie:** Gry sortowane od najwyższej oceny

---

## Uwagi Implementacyjne

1. **Normalizacja Parametrów** - Backend automatycznie konwertuje single `genre=RPG` na `['RPG']`
2. **Total dla Paginacji** - API zawsze zwraca `total` do obliczenia liczby stron na froncie
3. **Parametry Query** - Mogą być powtarzane dla wielu wartości (standard HTTP)
4. **Prepared Statements** - Wszystkie wartości parametrów są bezpieczne przed SQL injection
5. **GROUP BY** - Zapobieganie duplikatom przy wielu tagach na grę

---

## Możliwe Rozszerzenia

- [ ] Wyszukiwanie pełnotekstowe po tytule/opisie
- [ ] Zaawansowane sortowanie (np. po średniej ocenie + popularności)
- [ ] Filtrowanie po zakresie lat (od-do)
- [ ] Cache'owanie wyników
- [ ] Limit maksymalny na liczbę elementów per stronę
