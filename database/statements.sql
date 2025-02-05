
INSERT INTO user (username, password)
VALUES ("testUser1", "1234");

INSERT INTO team(team_id, team_name, nickname, logo_url)
VALUES (1, "Atlanta Hawks", "Hawks", "https://upload.wikimedia.org/wikipedia/fr/e/ee
/Hawks_2016.png");

INSERT INTO favorite (team_id, user_id)
VALUES (1, 1);