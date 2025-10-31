export function getAllGames(req, res) {
    res.json({ message: 'Lista gier (placeholder)' });
}

export function getGameById(req, res) {
    res.json({ message: `Szczegoly gry ${req.params.id}` });
}

export function createGame(req, res) {
    res.json({ message: 'Dodano nowa gre (placeholder)' });
}

export function updateGame(req, res) {
    res.json({ message: `Zaktualizowano gre ${req.params.id}` });
}

export function deleteGame(req, res) {
    res.json({ message: `Usunieto gre ${req.params.id}` });
}