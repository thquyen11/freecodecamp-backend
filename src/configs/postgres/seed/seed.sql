INSERT INTO public."USERS" ("REFERENCE", "USER_NAME", "USER_PASSWORD")
VALUES (1, 'test', 'hash');

INSERT INTO public."EXERCISES"("REFERENCE", "DESCRIPTION", "DURATION", "USER_ID", "DATE")
VALUES (1, 'test_exercise', 60, 1, '2019-01-08')