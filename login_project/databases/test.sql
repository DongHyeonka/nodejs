DROP DATABASE IF EXISTS testdb;

CREATE DATABASE IF NOT EXISTS testdb 
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

USE testdb;

CREATE TABLE Users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  emailCheck INT DEFAULT 0,
  uuid VARCHAR(36) UNIQUE,
  uuidCheck INT DEFAULT 0,
  UNIQUE (salt),
  UNIQUE (password),
  UNIQUE (username),
  UNIQUE (email)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE review (
  id INT PRIMARY KEY,
  user_id INT,
  title VARCHAR(50),
  writer VARCHAR(50),
  content VARCHAR(255),
  rating DECIMAL(2,1),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

