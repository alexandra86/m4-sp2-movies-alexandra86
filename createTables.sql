CREATE DATABASE tables;

CREATE TABLE movies(
id BIGSERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
description TEXT,
duration INTEGER NOT NULL,
price INTEGER NOT NULL
);

INSERT INTO
	movies(name, description, duration, price)
	VALUES
	('exemplo', NULL, 100, 74)
	RETURNING *;
	
SELECT 
	*
FROM 
	movies;