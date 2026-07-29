--
-- PostgreSQL database dump
--

\restrict zqFv82lNRccwGuUzGcrNQCJiiytPiG354j78tZi5QT3YpNWIZzKfMZEKME2zzEM

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
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    email text NOT NULL,
    instagram text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL
);


--
-- Name: COLUMN users.instagram; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.instagram IS 'instagram handle';


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users Enable signup for users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable signup for users" ON public.users FOR INSERT WITH CHECK (true);


--
-- Name: users Enable users to view their own data only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable users to view their own data only" ON public.users FOR SELECT TO authenticated USING (((( SELECT auth.uid() AS uid) = id) OR (EXISTS ( SELECT 1
   FROM public.users_roles
  WHERE ((users_roles.id = auth.uid()) AND (users_roles.role = 'admin'::text))))));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict zqFv82lNRccwGuUzGcrNQCJiiytPiG354j78tZi5QT3YpNWIZzKfMZEKME2zzEM

