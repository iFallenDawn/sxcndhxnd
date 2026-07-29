--
-- PostgreSQL database dump
--

\restrict 0Ydy17x95VjzSCYs6GsZB2kmJXhfZrbvWiASQcyvE6UnsA1o9cves4aXSonaPzo

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
-- Name: commissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid DEFAULT gen_random_uuid(),
    product_id uuid,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    commission_type text NOT NULL,
    piece_vision text NOT NULL,
    base_material boolean NOT NULL,
    creative_control boolean NOT NULL,
    colors text NOT NULL,
    fabrics text NOT NULL,
    shape_patterns text NOT NULL,
    distress boolean NOT NULL,
    retailor boolean NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    weekly_checkins boolean NOT NULL,
    pockets boolean NOT NULL,
    extra text,
    symmetry_type text NOT NULL
);


--
-- Name: TABLE commissions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.commissions IS 'commissions table';


--
-- Name: commissions commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commissions
    ADD CONSTRAINT commissions_pkey PRIMARY KEY (id);


--
-- Name: commissions commissions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commissions
    ADD CONSTRAINT commissions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: commissions commissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commissions
    ADD CONSTRAINT commissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: commissions Enable insert access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert access for all users" ON public.commissions FOR INSERT WITH CHECK (true);


--
-- Name: commissions Enable read access for users and their own commissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for users and their own commissions" ON public.commissions FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: commissions Only admins can modify commissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can modify commissions" ON public.commissions USING ((EXISTS ( SELECT 1
   FROM public.users_roles
  WHERE ((users_roles.id = auth.uid()) AND (users_roles.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.users_roles
  WHERE ((users_roles.id = auth.uid()) AND (users_roles.role = 'admin'::text)))));


--
-- Name: commissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 0Ydy17x95VjzSCYs6GsZB2kmJXhfZrbvWiASQcyvE6UnsA1o9cves4aXSonaPzo

