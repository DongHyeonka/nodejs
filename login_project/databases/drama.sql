DROP DATABASE IF EXISTS dramadb;

CREATE DATABASE IF NOT EXISTS dramadb 
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

USE dramadb;

CREATE TABLE Users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE dramas(
  drama_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  drama_title VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  release_date VARCHAR(50),
  provider VARCHAR(100),
  rating DECIMAL(2, 1)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE UserReviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  drama_id INT,
  user_id INT,
  review TEXT,
  rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 10),
  FOREIGN KEY (drama_id) REFERENCES dramas(drama_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE Info (
  info_id INT AUTO_INCREMENT PRIMARY KEY,
  drama_id INT,
  plot TEXT,
  viewership_rate DECIMAL(2, 1),
  FOREIGN KEY (drama_id) REFERENCES dramas(drama_id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE OfficialVideo (
  video_id INT AUTO_INCREMENT PRIMARY KEY,
  drama_id INT,
  title VARCHAR(100) NOT NULL,
  url VARCHAR(200) NOT NULL,
  FOREIGN KEY (drama_id) REFERENCES dramas(drama_id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE Cast (
  cast_id INT AUTO_INCREMENT PRIMARY KEY,
  drama_id INT,
  actor_name VARCHAR(100) NOT NULL,
  character_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (drama_id) REFERENCES dramas(drama_id)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8 
  DEFAULT COLLATE utf8_general_ci;

ALTER TABLE dramas ADD UNIQUE (drama_title);

INSERT INTO dramas (drama_title, genre, release_date, provider, rating)
VALUES 
  ('구미호 뎐', '판타지', '2020-10-7 ~ 2020.12.3', 'https://www.tving.com/contents/P001337350', 0),
  ('패밀리', '코미디 드라마', '2023-4-17 ~ 2023.5.23', 'https://www.tving.com/contents/P001711940', 0),
  ('불가살', '판타지 영화', '2021-12-18 ~ 2022.2.6', 'https://www.tving.com/contents/P001543232', 0),
  ('사랑의 이해', '로맨스', '2022-12-21 ~ 2023.2.9', 'https://www.tving.com/contents/P001677673', 0);

ALTER TABLE Info ADD UNIQUE (drama_id);

INSERT INTO Info (drama_id, plot, viewership_rate)
VALUES 
  ('1', '1938년 혼돈의 시대에 불시착한 구미호가 현대로 돌아가기 위해 펼치는 K-판타지 액션 활극', '6.7'),
  ('2', '평범한 직장인으로 신분을 위장한 국정원 블랙 요원 남편과 완벽한 가족을 꿈꾸는 달콤살벌한 아내의 아슬아슬한 가족 사수 첩보 코미디 드라마', '3.2'),
  ('3', '죽일 수도, 죽을 수도 없는 불가살(不可殺)이 된 남자가 600년 동안 환생을 반복하는 한 여자를 쫓는 슬프지만 아름다운 이야기', '6.3'),
  ('4', '각기 다른 이해(利害)를 가진 이들이 서로를 만나 진정한 사랑의 의미를 이해(理解) 하게 되는 이야기를 담은 멜로드라마', '3.6');