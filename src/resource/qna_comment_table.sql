CREATE TABLE IF NOT EXISTS `whereismyhome`.`qna` (
  `question_no` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(16) NULL DEFAULT NULL,
  `question_title` VARCHAR(100) NULL DEFAULT NULL,
  `question_content` VARCHAR(2000) NULL DEFAULT NULL,
  `question_hit` INT NULL DEFAULT '0',
  `question_write_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_no`),
  INDEX `qna_to_users_user_id_fk` (`user_id` ASC) VISIBLE,
  CONSTRAINT `qna_to_users_user_id_fk`
    FOREIGN KEY (`user_id`)
    REFERENCES `whereismyhome`.`member` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `whereismyhome`.`comment` (
  `comment_no` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(16) NOT NULL,
  `question_no` INT NOT NULL,
  `comment_content` VARCHAR(2000) NOT NULL,
  `comment_write_time` VARCHAR(45) NULL DEFAULT 'CURRENT_TIMESTAMP',
  PRIMARY KEY (`comment_no`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `question_no_idx` (`question_no` ASC) VISIBLE,
  CONSTRAINT `question_no_fk`
    FOREIGN KEY (`question_no`)
    REFERENCES `whereismyhome`.`qna` (`question_no`)
    ON DELETE CASCADE,
  CONSTRAINT `user_id_fk`
    FOREIGN KEY (`user_id`)
    REFERENCES `whereismyhome`.`member` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;