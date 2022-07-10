const express = require('express');
const app = express();
const api = express.Router();
api.use(express.json());

const Database = require('better-sqlite3');
const { json } = require('express');
const db = new Database('knowledge.db');
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

api.get('/locations', (req,res) => {
    res.json(db.prepare("SELECT DISTINCT location FROM snippets WHERE NOT location=''").pluck().all());
});

api.get('/snippets', (req,res) => {
    if(req.query.location !== undefined) res.json(db.prepare('SELECT * FROM snippets WHERE location=?').all(req.query.location));
    else if(req.query.locationLike !== undefined) res.json(db.prepare("SELECT * FROM snippets WHERE location LIKE ('%' || ? || '%')").all(req.query.locationLike));
    else if(req.query.contentLike !== undefined) res.json(db.prepare("SELECT * FROM snippets WHERE content LIKE ('%' || ? || '%')").all(req.query.contentLike));
    else if(req.query.random !== undefined) res.json(db.prepare("SELECT * FROM snippets WHERE location LIKE ('%' || ? || '%') ORDER BY RANDOM() LIMIT 1").all(req.query.random));
    else res.json(false);
});

api.post('/snippets', (req,res) => {
    if(req.body.location === undefined) return res.json(false);
    res.json({id: db.prepare('INSERT INTO snippets (location) VALUES (?)').run(req.body.location).lastInsertRowid});
});

api.post('/snippets/:id', (req,res) => {
    const changes = {location: false,content: false};
    if (req.params.id === undefined) return res.json(changes);
    if (req.body.location !== undefined) changes.location = db.prepare('UPDATE snippets SET location=? WHERE id=?').run(req.body.location, req.params.id).changes === 1;
    if (req.body.content !== undefined) changes.content = db.prepare('UPDATE snippets SET content=? WHERE id=?').run(req.body.content, req.params.id).changes === 1;
    res.json(changes);
});
api.delete('/snippets/:id', (req,res) => {
    if (req.params.id === undefined) return res.json(false);
    res.json(db.prepare('DELETE FROM snippets WHERE id=?').run(req.params.id).changes > 0);
});

api.get('/questions', (req,res) => {
    if(req.query.snippet === undefined) return res.json(false);
    res.json(db.prepare('SELECT * FROM questions WHERE snippet=?').all(req.query.snippet));
});
api.post('/questions', (req,res) => {
    if(req.body.snippet === undefined) return res.json(false);
    res.json({id: db.prepare('INSERT INTO questions (snippet) VALUES (?)').run(req.body.snippet).lastInsertRowid});
});
api.post('/questions/:id', (req,res) => {
    const changes = {content: false};
    if (req.params.id === undefined || req.body.content === undefined) return res.json(changes);
    changes.content = db.prepare('UPDATE questions SET content=? WHERE id=?').run(req.body.content, req.params.id).changes === 1;
    res.json(changes);
});
api.delete('/questions/:id', (req,res) => {
    if (req.params.id === undefined) return res.json(false);
    res.json(db.prepare('DELETE FROM questions WHERE id=?').run(req.params.id).changes > 0);
});

api.get('/learn', (req,res) => {
    if(req.query.locationLike === undefined) return res.json(false);
    res.json(db.prepare("SELECT snippets.id AS snippet_id, location, snippets.content AS snippet_content, questions.id AS question_id, questions.content as question_content FROM snippets INNER JOIN questions ON snippets.id=questions.snippet WHERE location LIKE ('%' || ? || '%') ORDER BY RANDOM() LIMIT 1").get(req.query.locationLike));
});

app.use(express.static('client/public'));
app.use('/api', api);

app.listen(3000, 'localhost', () => console.log("MiniWisdom is listening on port 3000."));