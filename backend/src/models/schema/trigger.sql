--  Vote Counter  --

DELIMITER $$

CREATE TRIGGER `total_vote_count`
AFTER INSERT ON `point_log`
FOR EACH ROW
BEGIN
  IF NEW.game_id IS NOT NULL THEN
    UPDATE `Game`
    SET total_votes = COALESCE(total_votes, 0) + 1
    WHERE id = NEW.game_id;
  END IF;
END$$

DELIMITER ;


--  All Point Counter  --

DELIMITER $$

CREATE TRIGGER `total_points_count`
AFTER INSERT ON `point_log`
FOR EACH ROW
BEGIN
  IF NEW.game_id IS NOT NULL AND NEW.point_value_id IS NOT NULL THEN
    UPDATE `Game` g
    JOIN `PointValue` pv ON pv.id = NEW.point_value_id
    SET g.total_points = COALESCE(g.total_points, 0) + pv.value
    WHERE g.id = NEW.game_id;
  END IF;
END$$

DELIMITER ;


-- Point calculator --

-- usuń istniejące trigger-y jeśli są

DELIMITER $$

CREATE TRIGGER `recalc_points_before_insert`
BEFORE INSERT ON `Game`
FOR EACH ROW
BEGIN
  IF COALESCE(NEW.total_votes, 0) = 0 THEN
    SET NEW.points = 0.0;
  ELSE
    SET NEW.points = ROUND( COALESCE(NEW.total_points, 0) / NEW.total_votes, 1 );
  END IF;
END$$

CREATE TRIGGER `recalc_points_before_update`
BEFORE UPDATE ON `Game`
FOR EACH ROW
BEGIN
  IF (COALESCE(OLD.total_points,0) <> COALESCE(NEW.total_points,0))
     OR (COALESCE(OLD.total_votes,0) <> COALESCE(NEW.total_votes,0)) THEN

    IF COALESCE(NEW.total_votes, 0) = 0 THEN
      SET NEW.points = 0.0;
    ELSE
      SET NEW.points = ROUND( COALESCE(NEW.total_points, 0) / NEW.total_votes, 1 );
    END IF;
  END IF;
END$$

DELIMITER ;
