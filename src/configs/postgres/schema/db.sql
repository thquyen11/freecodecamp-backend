--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 10.4

-- Started on 2019-01-08 22:33:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12924)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2817 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 16504)
-- Name: EXERCISES; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EXERCISES" (
    "REFERENCE" integer NOT NULL,
    "DESCRIPTION" character varying(50) NOT NULL,
    "DURATION" numeric(24,4),
    "USER_ID" integer NOT NULL,
    "DATE" date
);


ALTER TABLE public."EXERCISES" OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16507)
-- Name: EXERCISES_REFERENCE_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EXERCISES_REFERENCE_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EXERCISES_REFERENCE_seq" OWNER TO postgres;

--
-- TOC entry 2819 (class 0 OID 0)
-- Dependencies: 197
-- Name: EXERCISES_REFERENCE_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EXERCISES_REFERENCE_seq" OWNED BY public."EXERCISES"."REFERENCE";


--
-- TOC entry 198 (class 1259 OID 16509)
-- Name: USERS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."USERS" (
    "REFERENCE" integer NOT NULL,
    "USER_NAME" character varying(50) NOT NULL,
    "USER_PASSWORD" character varying(100)
);


ALTER TABLE public."USERS" OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 16512)
-- Name: USERS_REFERENCE_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."USERS_REFERENCE_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."USERS_REFERENCE_seq" OWNER TO postgres;

--
-- TOC entry 2822 (class 0 OID 0)
-- Dependencies: 199
-- Name: USERS_REFERENCE_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."USERS_REFERENCE_seq" OWNED BY public."USERS"."REFERENCE";


--
-- TOC entry 2678 (class 2604 OID 16514)
-- Name: EXERCISES REFERENCE; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EXERCISES" ALTER COLUMN "REFERENCE" SET DEFAULT nextval('public."EXERCISES_REFERENCE_seq"'::regclass);


--
-- TOC entry 2679 (class 2604 OID 16515)
-- Name: USERS REFERENCE; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS" ALTER COLUMN "REFERENCE" SET DEFAULT nextval('public."USERS_REFERENCE_seq"'::regclass);


--
-- TOC entry 2806 (class 0 OID 16504)
-- Dependencies: 196
-- Data for Name: EXERCISES; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EXERCISES" ("REFERENCE", "DESCRIPTION", "DURATION", "USER_ID", "DATE") FROM stdin;
\.


--
-- TOC entry 2808 (class 0 OID 16509)
-- Dependencies: 198
-- Data for Name: USERS; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."USERS" ("REFERENCE", "USER_NAME", "USER_PASSWORD") FROM stdin;
3	DB_RI	$2a$10$dXA1Tg6kOKJUBcg.QpGQKOAhqtMQ8FA5FcYQb1E8IRLf.U483w6Sa
\.


--
-- TOC entry 2824 (class 0 OID 0)
-- Dependencies: 197
-- Name: EXERCISES_REFERENCE_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EXERCISES_REFERENCE_seq"', 4, true);


--
-- TOC entry 2825 (class 0 OID 0)
-- Dependencies: 199
-- Name: USERS_REFERENCE_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."USERS_REFERENCE_seq"', 3, true);


--
-- TOC entry 2681 (class 2606 OID 16517)
-- Name: EXERCISES EXERCISES_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EXERCISES"
    ADD CONSTRAINT "EXERCISES_pkey" PRIMARY KEY ("REFERENCE");


--
-- TOC entry 2683 (class 2606 OID 16519)
-- Name: USERS USERS_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "USERS_pkey" PRIMARY KEY ("REFERENCE");


--
-- TOC entry 2684 (class 2606 OID 16520)
-- Name: EXERCISES FK_EXERCISES_USERS; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EXERCISES"
    ADD CONSTRAINT "FK_EXERCISES_USERS" FOREIGN KEY ("USER_ID") REFERENCES public."USERS"("REFERENCE");


--
-- TOC entry 2818 (class 0 OID 0)
-- Dependencies: 196
-- Name: TABLE "EXERCISES"; Type: ACL; Schema: public; Owner: postgres
--

GRANT INSERT,REFERENCES,DELETE,TRUNCATE,UPDATE ON TABLE public."EXERCISES" TO "DB_RI";
GRANT SELECT ON TABLE public."EXERCISES" TO "DB_RI" WITH GRANT OPTION;


--
-- TOC entry 2820 (class 0 OID 0)
-- Dependencies: 197
-- Name: SEQUENCE "EXERCISES_REFERENCE_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT USAGE,UPDATE ON SEQUENCE public."EXERCISES_REFERENCE_seq" TO "DB_RI";
GRANT SELECT ON SEQUENCE public."EXERCISES_REFERENCE_seq" TO "DB_RI" WITH GRANT OPTION;


--
-- TOC entry 2821 (class 0 OID 0)
-- Dependencies: 198
-- Name: TABLE "USERS"; Type: ACL; Schema: public; Owner: postgres
--

GRANT INSERT,REFERENCES,DELETE,TRUNCATE,UPDATE ON TABLE public."USERS" TO "DB_RI";
GRANT SELECT ON TABLE public."USERS" TO "DB_RI" WITH GRANT OPTION;


--
-- TOC entry 2823 (class 0 OID 0)
-- Dependencies: 199
-- Name: SEQUENCE "USERS_REFERENCE_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT USAGE,UPDATE ON SEQUENCE public."USERS_REFERENCE_seq" TO "DB_RI";
GRANT SELECT ON SEQUENCE public."USERS_REFERENCE_seq" TO "DB_RI" WITH GRANT OPTION;


--
-- TOC entry 1675 (class 826 OID 16525)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT INSERT,DELETE,TRUNCATE,UPDATE ON TABLES  TO "DB_RI";
ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT ON TABLES  TO "DB_RI" WITH GRANT OPTION;


--
-- TOC entry 1676 (class 826 OID 16526)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES  FROM postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT INSERT,DELETE,TRUNCATE,UPDATE ON TABLES  TO "DB_RI";
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT ON TABLES  TO "DB_RI" WITH GRANT OPTION;


-- Completed on 2019-01-08 22:33:39

--
-- PostgreSQL database dump complete
--

