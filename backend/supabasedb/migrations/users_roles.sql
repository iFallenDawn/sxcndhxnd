--
-- PostgreSQL database dump
--

\restrict kp4fNS63BvNUiB1CDQxu6VmGnY62KcfhQtTH443LqhSVs1Iy0edgnME7HIvzBLt

-- Dumped from database version 15.8
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: users_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_roles (
    id uuid NOT NULL,
    role text NOT NULL
);


--
-- Name: users_roles users_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT users_roles_pkey PRIMARY KEY (id);


--
-- Name: users_roles Allow role lookup for RLS; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow role lookup for RLS" ON public.users_roles FOR SELECT USING (true);


--
-- Name: users_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict kp4fNS63BvNUiB1CDQxu6VmGnY62KcfhQtTH443LqhSVs1Iy0edgnME7HIvzBLt

