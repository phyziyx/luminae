ALTER TABLE User
	ADD COLUMN firstName VARCHAR(255),
	ADD COLUMN lastName VARCHAR(255);

UPDATE User
SET
	firstName = CASE
		WHEN LENGTH(name) - LENGTH(REPLACE(name, ' ', '')) = 2 THEN
			SUBSTRING_INDEX(name, ' ', 2) -- First two words as firstName
		ELSE
			SUBSTRING_INDEX(name, ' ', 1) -- First word as firstName
	END,
	lastName = CASE
		WHEN LENGTH(name) - LENGTH(REPLACE(name, ' ', '')) = 2 THEN
			SUBSTRING_INDEX(name, ' ', -1) -- Last word as lastName
		ELSE
			SUBSTRING_INDEX(name, ' ', -1) -- Last word as lastName
	END;

ALTER TABLE User
	DROP COLUMN name;