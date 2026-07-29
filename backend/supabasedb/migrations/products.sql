--
-- PostgreSQL database dump
--

\restrict gL8CfkpJQeMzyuiEmk8F9G8zVveT9VCaq0FOhadcdGA8PJ3WsRG7C2obVbWldbk

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
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text,
    commission_id text,
    title text NOT NULL,
    description text NOT NULL,
    image_urls text[] NOT NULL,
    price numeric NOT NULL,
    status text NOT NULL,
    paid boolean,
    drop_item boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    drop_title text,
    category text,
    created_by uuid,
    size text
);


--
-- Name: TABLE products; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.products IS 'nico''s items';


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: products Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);


--
-- Name: products Only admins can modify products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can modify products" ON public.products USING ((EXISTS ( SELECT 1
   FROM public.users_roles
  WHERE ((users_roles.id = auth.uid()) AND (users_roles.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.users_roles
  WHERE ((users_roles.id = auth.uid()) AND (users_roles.role = 'admin'::text)))));


--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict gL8CfkpJQeMzyuiEmk8F9G8zVveT9VCaq0FOhadcdGA8PJ3WsRG7C2obVbWldbk

