USE mysql_project_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL
);

CREATE TABLE workouts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userid INT,
  date DATE,
  clocktime TIME,
  distance DEC(6,2),
  elapsedtime TIME,
  location VARCHAR(100),
  temperature INT DEFAULT NULL,
  feels_like_temperature INT DEFAULT NULL,
  humidity INT DEFAULT NULL,
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);