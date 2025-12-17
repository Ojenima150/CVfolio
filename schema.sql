--
-- PostgreSQL database dump
--

\restrict GlmDjw0ebCCKR0RS6xJYgjAnnKg212wKtdowbkmePbsKMdMgGf6GcEAiDsIeFUe

-- Dumped from database version 15.4
-- Dumped by pg_dump version 17.6

-- Started on 2025-12-14 00:10:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16797)
-- Name: about; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.about (
    id integer NOT NULL,
    content text
);


ALTER TABLE public.about OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16796)
-- Name: about_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.about_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_id_seq OWNER TO postgres;

--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 222
-- Name: about_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.about_id_seq OWNED BY public.about.id;


--
-- TOC entry 225 (class 1259 OID 16806)
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    title character varying(255),
    name_school character varying(255),
    type_of_certificate character varying(255),
    end_date date,
    certificate_link text,
    image_path text
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16805)
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificates_id_seq OWNER TO postgres;

--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 224
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- TOC entry 221 (class 1259 OID 16778)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    name character varying(100),
    email character varying(100),
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16777)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 220
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 235 (class 1259 OID 24945)
-- Name: core_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.core_skills (
    id integer NOT NULL,
    name text NOT NULL,
    level text
);


ALTER TABLE public.core_skills OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 24944)
-- Name: core_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.core_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.core_skills_id_seq OWNER TO postgres;

--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 234
-- Name: core_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.core_skills_id_seq OWNED BY public.core_skills.id;


--
-- TOC entry 217 (class 1259 OID 16760)
-- Name: experience; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.experience (
    id integer NOT NULL,
    title character varying(150),
    company character varying(150),
    start_date character varying(50),
    end_date character varying(50),
    description text
);


ALTER TABLE public.experience OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16759)
-- Name: experience_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.experience_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.experience_id_seq OWNER TO postgres;

--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 216
-- Name: experience_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.experience_id_seq OWNED BY public.experience.id;


--
-- TOC entry 229 (class 1259 OID 16825)
-- Name: hero; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hero (
    id integer NOT NULL,
    heading text,
    subheading text,
    description text
);


ALTER TABLE public.hero OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16824)
-- Name: hero_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hero_id_seq OWNER TO postgres;

--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 228
-- Name: hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hero_id_seq OWNED BY public.hero.id;


--
-- TOC entry 227 (class 1259 OID 16815)
-- Name: hire_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hire_projects (
    id integer NOT NULL,
    project_name character varying(255) NOT NULL,
    hire_name character varying(255) NOT NULL,
    hire_email character varying(255) NOT NULL,
    folder_path character varying(255) NOT NULL,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.hire_projects OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16814)
-- Name: hire_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hire_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hire_projects_id_seq OWNER TO postgres;

--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 226
-- Name: hire_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hire_projects_id_seq OWNED BY public.hire_projects.id;


--
-- TOC entry 231 (class 1259 OID 16834)
-- Name: hire_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hire_ratings (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    rating integer NOT NULL,
    reference text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT hire_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.hire_ratings OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16833)
-- Name: hire_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hire_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hire_ratings_id_seq OWNER TO postgres;

--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 230
-- Name: hire_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hire_ratings_id_seq OWNED BY public.hire_ratings.id;


--
-- TOC entry 233 (class 1259 OID 16846)
-- Name: project_downloads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_downloads (
    id integer NOT NULL,
    email text NOT NULL,
    project_name text NOT NULL,
    download_count integer DEFAULT 0
);


ALTER TABLE public.project_downloads OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16845)
-- Name: project_downloads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_downloads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_downloads_id_seq OWNER TO postgres;

--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 232
-- Name: project_downloads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_downloads_id_seq OWNED BY public.project_downloads.id;


--
-- TOC entry 219 (class 1259 OID 16769)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying(150),
    description text,
    github_link text,
    live_link text
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16768)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- TOC entry 3417 (class 0 OID 0)
-- Dependencies: 218
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- TOC entry 215 (class 1259 OID 16753)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16752)
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO postgres;

--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 214
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- TOC entry 3228 (class 2604 OID 16800)
-- Name: about id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about ALTER COLUMN id SET DEFAULT nextval('public.about_id_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 16809)
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- TOC entry 3226 (class 2604 OID 16781)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 3237 (class 2604 OID 24948)
-- Name: core_skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.core_skills ALTER COLUMN id SET DEFAULT nextval('public.core_skills_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 16763)
-- Name: experience id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experience ALTER COLUMN id SET DEFAULT nextval('public.experience_id_seq'::regclass);


--
-- TOC entry 3232 (class 2604 OID 16828)
-- Name: hero id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hero ALTER COLUMN id SET DEFAULT nextval('public.hero_id_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 16818)
-- Name: hire_projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hire_projects ALTER COLUMN id SET DEFAULT nextval('public.hire_projects_id_seq'::regclass);


--
-- TOC entry 3233 (class 2604 OID 16837)
-- Name: hire_ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hire_ratings ALTER COLUMN id SET DEFAULT nextval('public.hire_ratings_id_seq'::regclass);


--
-- TOC entry 3235 (class 2604 OID 16849)
-- Name: project_downloads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_downloads ALTER COLUMN id SET DEFAULT nextval('public.project_downloads_id_seq'::regclass);


--
-- TOC entry 3225 (class 2604 OID 16772)
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- TOC entry 3223 (class 2604 OID 16756)
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- TOC entry 3248 (class 2606 OID 16804)
-- Name: about about_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about
    ADD CONSTRAINT about_pkey PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 16813)
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 16786)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 24952)
-- Name: core_skills core_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.core_skills
    ADD CONSTRAINT core_skills_pkey PRIMARY KEY (id);


--
-- TOC entry 3242 (class 2606 OID 16767)
-- Name: experience experience_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experience
    ADD CONSTRAINT experience_pkey PRIMARY KEY (id);


--
-- TOC entry 3254 (class 2606 OID 16832)
-- Name: hero hero_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hero
    ADD CONSTRAINT hero_pkey PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 16823)
-- Name: hire_projects hire_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hire_projects
    ADD CONSTRAINT hire_projects_pkey PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 16843)
-- Name: hire_ratings hire_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hire_ratings
    ADD CONSTRAINT hire_ratings_pkey PRIMARY KEY (id);


--
-- TOC entry 3258 (class 2606 OID 16854)
-- Name: project_downloads project_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_downloads
    ADD CONSTRAINT project_downloads_pkey PRIMARY KEY (id);


--
-- TOC entry 3244 (class 2606 OID 16776)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 3240 (class 2606 OID 16758)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


-- Completed on 2025-12-14 00:10:24

--
-- PostgreSQL database dump complete
--

\unrestrict GlmDjw0ebCCKR0RS6xJYgjAnnKg212wKtdowbkmePbsKMdMgGf6GcEAiDsIeFUe

