CREATE TABLE "snippets" (
	"id"	INTEGER,
	"location"	TEXT NOT NULL DEFAULT '',
	"content"	TEXT NOT NULL DEFAULT '',
	PRIMARY KEY("id")
);
CREATE TABLE "questions" (
	"id"	INTEGER,
	"snippet"	INTEGER NOT NULL,
	"content"	TEXT NOT NULL DEFAULT '',
	FOREIGN KEY("snippet") REFERENCES "snippets"("id") ON DELETE CASCADE,
	PRIMARY KEY("id")
);