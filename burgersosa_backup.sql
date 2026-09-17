--
-- PostgreSQL database dump
--

\restrict 58XMkcfYwvAiPOyeMQfjFOlZmzKh1prrtXEKtrp1abSwOsu5iYK8xxjbIwg1Qyp

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

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

ALTER TABLE ONLY public."StockMovement" DROP CONSTRAINT "StockMovement_userId_fkey";
ALTER TABLE ONLY public."StockMovement" DROP CONSTRAINT "StockMovement_ingredientId_fkey";
ALTER TABLE ONLY public."RecipeItem" DROP CONSTRAINT "RecipeItem_productId_fkey";
ALTER TABLE ONLY public."RecipeItem" DROP CONSTRAINT "RecipeItem_ingredientId_fkey";
ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_categoryId_fkey";
ALTER TABLE ONLY public."OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
ALTER TABLE ONLY public."OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";
ALTER TABLE ONLY public."OrderItemModifier" DROP CONSTRAINT "OrderItemModifier_orderItemId_fkey";
ALTER TABLE ONLY public."OrderItemModifier" DROP CONSTRAINT "OrderItemModifier_modifierId_fkey";
ALTER TABLE ONLY public."Modifier" DROP CONSTRAINT "Modifier_productId_fkey";
ALTER TABLE ONLY public."ModifierIngredient" DROP CONSTRAINT "ModifierIngredient_modifierId_fkey";
ALTER TABLE ONLY public."ModifierIngredient" DROP CONSTRAINT "ModifierIngredient_ingredientId_fkey";
DROP INDEX public."User_email_key";
DROP INDEX public."RecipeItem_productId_ingredientId_key";
DROP INDEX public."Order_orderNumber_key";
DROP INDEX public."ModifierIngredient_modifierId_ingredientId_key";
ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
ALTER TABLE ONLY public."StoreSettings" DROP CONSTRAINT "StoreSettings_pkey";
ALTER TABLE ONLY public."StockMovement" DROP CONSTRAINT "StockMovement_pkey";
ALTER TABLE ONLY public."RecipeItem" DROP CONSTRAINT "RecipeItem_pkey";
ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_pkey";
ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_pkey";
ALTER TABLE ONLY public."OrderItem" DROP CONSTRAINT "OrderItem_pkey";
ALTER TABLE ONLY public."OrderItemModifier" DROP CONSTRAINT "OrderItemModifier_pkey";
ALTER TABLE ONLY public."Modifier" DROP CONSTRAINT "Modifier_pkey";
ALTER TABLE ONLY public."ModifierIngredient" DROP CONSTRAINT "ModifierIngredient_pkey";
ALTER TABLE ONLY public."Ingredient" DROP CONSTRAINT "Ingredient_pkey";
ALTER TABLE ONLY public."Category" DROP CONSTRAINT "Category_pkey";
ALTER TABLE public."User" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."StockMovement" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."RecipeItem" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Product" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."OrderItemModifier" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."OrderItem" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Order" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."ModifierIngredient" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Modifier" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Ingredient" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Category" ALTER COLUMN id DROP DEFAULT;
DROP TABLE public._prisma_migrations;
DROP SEQUENCE public."User_id_seq";
DROP TABLE public."User";
DROP TABLE public."StoreSettings";
DROP SEQUENCE public."StockMovement_id_seq";
DROP TABLE public."StockMovement";
DROP SEQUENCE public."RecipeItem_id_seq";
DROP TABLE public."RecipeItem";
DROP SEQUENCE public."Product_id_seq";
DROP TABLE public."Product";
DROP SEQUENCE public."Order_id_seq";
DROP SEQUENCE public."OrderItem_id_seq";
DROP SEQUENCE public."OrderItemModifier_id_seq";
DROP TABLE public."OrderItemModifier";
DROP TABLE public."OrderItem";
DROP TABLE public."Order";
DROP SEQUENCE public."Modifier_id_seq";
DROP SEQUENCE public."ModifierIngredient_id_seq";
DROP TABLE public."ModifierIngredient";
DROP TABLE public."Modifier";
DROP SEQUENCE public."Ingredient_id_seq";
DROP TABLE public."Ingredient";
DROP SEQUENCE public."Category_id_seq";
DROP TABLE public."Category";
DROP TYPE public."Role";
DROP TYPE public."OrderType";
DROP TYPE public."OrderStatus";
DROP TYPE public."MovementType";
--
-- Name: MovementType; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public."MovementType" AS ENUM (
    'PURCHASE',
    'SALE',
    'WASTE',
    'ADJUSTMENT',
    'RETURN'
);


ALTER TYPE public."MovementType" OWNER TO "user";

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO "user";

--
-- Name: OrderType; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public."OrderType" AS ENUM (
    'DELIVERY',
    'PICKUP'
);


ALTER TYPE public."OrderType" OWNER TO "user";

--
-- Name: Role; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'EMPLOYEE'
);


ALTER TYPE public."Role" OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO "user";

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO "user";

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Ingredient; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Ingredient" (
    id integer NOT NULL,
    name text NOT NULL,
    unit text NOT NULL,
    "currentStock" double precision DEFAULT 0 NOT NULL,
    "minStock" double precision DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Ingredient" OWNER TO "user";

--
-- Name: Ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."Ingredient_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Ingredient_id_seq" OWNER TO "user";

--
-- Name: Ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."Ingredient_id_seq" OWNED BY public."Ingredient".id;


--
-- Name: Modifier; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Modifier" (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    "productId" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Modifier" OWNER TO "user";

--
-- Name: ModifierIngredient; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."ModifierIngredient" (
    id integer NOT NULL,
    "modifierId" integer NOT NULL,
    "ingredientId" integer NOT NULL,
    quantity double precision NOT NULL
);


ALTER TABLE public."ModifierIngredient" OWNER TO "user";

--
-- Name: ModifierIngredient_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."ModifierIngredient_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ModifierIngredient_id_seq" OWNER TO "user";

--
-- Name: ModifierIngredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."ModifierIngredient_id_seq" OWNED BY public."ModifierIngredient".id;


--
-- Name: Modifier_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."Modifier_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Modifier_id_seq" OWNER TO "user";

--
-- Name: Modifier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."Modifier_id_seq" OWNED BY public."Modifier".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "orderNumber" text NOT NULL,
    "customerName" text NOT NULL,
    "customerPhone" text NOT NULL,
    "customerAddress" text,
    type public."OrderType" NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    "deliveryCost" numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) NOT NULL,
    "paymentMethod" text,
    "paymentStatus" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO "user";

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "unitPriceCaptured" numeric(10,2) NOT NULL,
    notes text
);


ALTER TABLE public."OrderItem" OWNER TO "user";

--
-- Name: OrderItemModifier; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."OrderItemModifier" (
    id integer NOT NULL,
    "orderItemId" integer NOT NULL,
    "modifierId" integer NOT NULL,
    "unitPriceCaptured" numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public."OrderItemModifier" OWNER TO "user";

--
-- Name: OrderItemModifier_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."OrderItemModifier_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OrderItemModifier_id_seq" OWNER TO "user";

--
-- Name: OrderItemModifier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."OrderItemModifier_id_seq" OWNED BY public."OrderItemModifier".id;


--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OrderItem_id_seq" OWNER TO "user";

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Order_id_seq" OWNER TO "user";

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image text,
    "isActive" boolean DEFAULT true NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO "user";

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_id_seq" OWNER TO "user";

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: RecipeItem; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."RecipeItem" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    "ingredientId" integer NOT NULL,
    quantity double precision NOT NULL
);


ALTER TABLE public."RecipeItem" OWNER TO "user";

--
-- Name: RecipeItem_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."RecipeItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."RecipeItem_id_seq" OWNER TO "user";

--
-- Name: RecipeItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."RecipeItem_id_seq" OWNED BY public."RecipeItem".id;


--
-- Name: StockMovement; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."StockMovement" (
    id integer NOT NULL,
    "ingredientId" integer NOT NULL,
    quantity double precision NOT NULL,
    type public."MovementType" NOT NULL,
    reason text,
    "userId" integer,
    "referenceId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."StockMovement" OWNER TO "user";

--
-- Name: StockMovement_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."StockMovement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."StockMovement_id_seq" OWNER TO "user";

--
-- Name: StockMovement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."StockMovement_id_seq" OWNED BY public."StockMovement".id;


--
-- Name: StoreSettings; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."StoreSettings" (
    id integer DEFAULT 1 NOT NULL,
    "storeIsOpen" boolean DEFAULT true NOT NULL,
    "scheduleDays" text DEFAULT '1,2,3,4,5,6'::text NOT NULL,
    "openTime" text DEFAULT '20:00'::text NOT NULL,
    "closeTime" text DEFAULT '00:00'::text NOT NULL,
    "closedMessage" text DEFAULT 'Hoy no abrimos, los esperamos en nuestro próximo día hábil con las mejores hamburguesas del Valle.'::text NOT NULL,
    "whatsappNumber" text DEFAULT '5493834974026'::text NOT NULL,
    "deliveryCost" numeric(10,2) DEFAULT 500 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StoreSettings" OWNER TO "user";

--
-- Name: User; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."Role" DEFAULT 'EMPLOYEE'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO "user";

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO "user";

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "user";

--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Ingredient id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Ingredient" ALTER COLUMN id SET DEFAULT nextval('public."Ingredient_id_seq"'::regclass);


--
-- Name: Modifier id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Modifier" ALTER COLUMN id SET DEFAULT nextval('public."Modifier_id_seq"'::regclass);


--
-- Name: ModifierIngredient id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."ModifierIngredient" ALTER COLUMN id SET DEFAULT nextval('public."ModifierIngredient_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: OrderItemModifier id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."OrderItemModifier" ALTER COLUMN id SET DEFAULT nextval('public."OrderItemModifier_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: RecipeItem id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."RecipeItem" ALTER COLUMN id SET DEFAULT nextval('public."RecipeItem_id_seq"'::regclass);


--
-- Name: StockMovement id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."StockMovement" ALTER COLUMN id SET DEFAULT nextval('public."StockMovement_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Category" (id, name, description, "isActive", "order", "createdAt", "updatedAt") FROM stdin;
1	Hamburguesas	\N	t	1	2026-09-16 04:02:19.154	2026-09-16 05:33:06.407
2	Papas	\N	t	2	2026-09-16 04:02:19.156	2026-09-16 05:33:06.412
7	Lomos	\N	t	3	2026-09-16 05:33:06.414	2026-09-16 05:33:06.414
8	Zappings	\N	t	4	2026-09-16 05:33:06.417	2026-09-16 05:33:06.417
3	Bebidas	\N	t	5	2026-09-16 04:02:19.156	2026-09-16 05:33:06.419
\.


--
-- Data for Name: Ingredient; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Ingredient" (id, name, unit, "currentStock", "minStock", "isActive") FROM stdin;
11	Cebolla	gramos	2000	500	t
5	Cebolla	gramos	20	500	t
7	Pan de Hamburguesa	unidades	99	20	t
8	Medallón de Carne	unidades	197	50	t
9	Queso Cheddar	gramos	4960	1000	t
10	Panceta	gramos	2950	500	t
12	Salsa Sosa	mililitros	3970	1000	t
1	Pan de Hamburguesa	unidades	97	20	t
2	Medallón de Carne	unidades	19	50	t
3	Queso Cheddar	gramos	4880	1000	t
4	Panceta	gramos	2850	500	t
6	Salsa Sosa	mililitros	3910	1000	t
\.


--
-- Data for Name: Modifier; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Modifier" (id, name, price, "productId", "isActive") FROM stdin;
1	Medallón Extra	2000.00	1	t
2	Sin Cebolla	0.00	1	t
3	Medallón Extra	2000.00	2	t
4	Sin Cebolla	0.00	2	t
\.


--
-- Data for Name: ModifierIngredient; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."ModifierIngredient" (id, "modifierId", "ingredientId", quantity) FROM stdin;
1	1	2	1
2	3	8	1
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Order" (id, "orderNumber", "customerName", "customerPhone", "customerAddress", type, status, subtotal, "deliveryCost", total, "paymentMethod", "paymentStatus", notes, "createdAt", "updatedAt") FROM stdin;
2	ORD-761599	gfgfgf	453453455	GPS: https://maps.google.com/?q=-28.467830220827583,-65.78845305807228	DELIVERY	CANCELLED	12000.00	500.00	12500.00	\N	\N	\N	2026-09-16 04:59:21.6	2026-09-16 05:06:08.045
1	ORD-377813	nachomiranda	294424550	GPS: https://maps.google.com/?q=-28.46822756997968,-65.78833766558472	DELIVERY	CANCELLED	36000.00	500.00	36500.00	\N	\N	\N	2026-09-16 04:36:17.815	2026-09-16 05:06:09.066
3	ORD-507164	Nacho Miranda	2944245550	GPS: https://maps.google.com/?q=-28.4682970544396,-65.78836435580467	DELIVERY	DELIVERED	14000.00	500.00	14500.00	\N	\N	\N	2026-09-16 05:45:07.168	2026-09-16 05:47:09.722
5	ORD-991803	Nacho Miranda	2944245550	GPS: https://maps.google.com/?q=-28.467831822973405,-65.78847026621132	DELIVERY	DELIVERED	5000.00	500.00	5500.00	\N	\N	\N	2026-09-16 06:43:11.805	2026-09-16 06:47:36.488
4	ORD-197021	Nacho Miranda	23432342	GPS: https://maps.google.com/?q=-28.4681145069883,-65.78838085501599	DELIVERY	DELIVERED	14000.00	500.00	14500.00	\N	\N	\N	2026-09-16 06:13:17.022	2026-09-16 06:47:37.298
6	ORD-545093	Nacho Miranda	2944245550	GPS: https://maps.google.com/?q=-28.46819495799553,-65.78807068380495	DELIVERY	DELIVERED	23000.00	500.00	23500.00	\N	\N	\N	2026-09-17 05:39:05.095	2026-09-17 05:40:48.295
7	ORD-945882	Nacho Miranda	2944245550	GPS: https://maps.google.com/?q=-28.468146577773346,-65.78821374482568	DELIVERY	DELIVERED	23000.00	500.00	23500.00	\N	\N	\N	2026-09-17 05:45:45.884	2026-09-17 05:46:43.07
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, "unitPriceCaptured", notes) FROM stdin;
1	1	1	3	12000.00	\N
2	2	1	1	12000.00	\N
3	3	2	1	12000.00	un toque quemada la carne, deaaaa
4	4	1	1	12000.00	\N
5	5	11	1	5000.00	sin mayoensa
6	6	1	1	12000.00	un poco quemada y crocante sin mayoensa
7	6	14	1	3000.00	\N
8	6	12	1	4000.00	\N
9	7	1	1	12000.00	un toque ahumada la carne y sin mayoensa
10	7	14	1	3000.00	\N
11	7	12	1	4000.00	\N
\.


--
-- Data for Name: OrderItemModifier; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."OrderItemModifier" (id, "orderItemId", "modifierId", "unitPriceCaptured") FROM stdin;
1	3	3	2000.00
2	4	1	2000.00
3	6	1	2000.00
4	6	1	2000.00
5	9	1	2000.00
6	9	1	2000.00
7	9	2	0.00
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Product" (id, name, description, price, image, "isActive", "categoryId", "createdAt", "updatedAt") FROM stdin;
14	Porción papas extras 	Porción de papas extras	3000.00	/uploads/1789620858632-891631529.png	t	2	2026-09-17 04:54:19.875	2026-09-17 04:54:19.875
11	carne perro	carne de perro ahumada 	5000.00	http://localhost:3000/uploads/1789537711684-405784924.png	f	1	2026-09-16 05:48:48.108	2026-09-17 05:47:19.675
5	Zapping Especial	Pan, carne, queso cremoso, jamón, huevo, lechuga, tomate, papas fritas y dip de mayo casera.	13000.00		t	8	2026-09-16 05:24:01.333	2026-09-16 05:37:04.569
4	Zapping Cheddar Doble	Pan, doble carne, doble cheddar, bacon, cebolla caramelizada, lechuga, tomate a elección, papas fritas y dip de mayo casera.	22500.00		t	8	2026-09-16 05:23:50.362	2026-09-16 05:40:12.033
9	Lomo Premium 	Pan, 200 g de bife, cheddar, bacon, huevo frito x2, cebolla morada, papas fritas y dip de mayo casera.	16000.00		t	7	2026-09-16 05:25:20.659	2026-09-16 05:40:34.138
10	Lomo Cheese	Pan, 200 g de bife, queso cheddar, cebolla morada, ketchup, papas fritas y dip de mayo casera.	13000.00		t	7	2026-09-16 05:25:38.623	2026-09-16 05:40:40.208
1	Doble Bacon	Doble medallón, cheddar, panceta y salsa sosa.	12000.00	/uploads/1789619825037-30876942.jpeg	t	1	2026-09-16 04:02:19.161	2026-09-17 04:37:06.776
2	Doble Bacon	Doble medallón, cheddar, panceta y salsa sosa.	12000.00	/uploads/1789619841150-105364681.jpeg	t	1	2026-09-16 04:04:50.854	2026-09-17 04:37:22.067
7	Lomo Deluxe	Pan, 200 g de bife, cheddar, bacon, cebolla caramelizada, lechuga, tomate, papas fritas y dip de mayo casera.	14000.00	/uploads/1789619858421-840579127.jpeg	t	7	2026-09-16 05:24:51.083	2026-09-17 04:37:39.425
3	Zapping Cheddar 	Pan, carne, cheddar, bacon, cebolla caramelizada, lechuga, tomate a elección, papas fritas y dip de mayo casera.	15500.00	/uploads/1789620041187-2570010.png	t	8	2026-09-16 05:20:03.873	2026-09-17 04:40:42.035
13	Cerveza Heineken 473 ml	Cerveza Heineken 473 ml ( Contiene Alcohol) 	5000.00	/uploads/1789620422574-981977008.png	t	3	2026-09-17 04:47:03.525	2026-09-17 04:47:03.525
12	Coca Cola 354 ml	Gaseosa Coca Cola (Sin alcohol) 	4000.00	/uploads/1789620123378-828582885.png	t	3	2026-09-17 04:42:04.448	2026-09-17 04:47:23.916
8	Lomo Especial	Pan, 200 g de bife, queso cremoso, jamón, huevo, lechuga, tomate, papas fritas y dip de mayo casera.	13000.00	/uploads/1789620477745-441814943.jpeg	t	7	2026-09-16 05:25:04.437	2026-09-17 04:47:58.287
6	Zapping Especial Doble	Pan, doble carne, doble queso cremoso, jamón, huevo, lechuga, tomate, papas fritas y dip de mayo casera.	20000.00	/uploads/1789620496128-380559559.png	t	8	2026-09-16 05:24:11.355	2026-09-17 04:48:16.771
\.


--
-- Data for Name: RecipeItem; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."RecipeItem" (id, "productId", "ingredientId", quantity) FROM stdin;
1	1	1	1
2	1	2	2
3	1	3	40
4	1	4	50
5	1	6	30
6	2	7	1
7	2	8	2
8	2	9	40
9	2	10	50
10	2	12	30
\.


--
-- Data for Name: StockMovement; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."StockMovement" (id, "ingredientId", quantity, type, reason, "userId", "referenceId", "createdAt") FROM stdin;
1	5	10	ADJUSTMENT	compra	\N	\N	2026-09-16 05:06:44.743
2	5	10	ADJUSTMENT	as	\N	\N	2026-09-16 05:06:58.497
3	5	-2010	ADJUSTMENT	compra	\N	\N	2026-09-16 05:21:43.783
4	5	10	ADJUSTMENT	-	\N	\N	2026-09-16 05:22:09.09
5	7	-1	SALE	Consumo automático por orden #ORD-507164	\N	3	2026-09-16 05:46:59.142
6	8	-3	SALE	Consumo automático por orden #ORD-507164	\N	3	2026-09-16 05:46:59.18
7	9	-40	SALE	Consumo automático por orden #ORD-507164	\N	3	2026-09-16 05:46:59.186
8	10	-50	SALE	Consumo automático por orden #ORD-507164	\N	3	2026-09-16 05:46:59.192
9	12	-30	SALE	Consumo automático por orden #ORD-507164	\N	3	2026-09-16 05:46:59.197
10	2	-170	ADJUSTMENT	falta comprar mas 	\N	\N	2026-09-16 05:47:44.825
11	1	-1	SALE	Consumo automático por orden #ORD-197021	\N	4	2026-09-16 06:46:39.933
12	2	-3	SALE	Consumo automático por orden #ORD-197021	\N	4	2026-09-16 06:46:39.947
13	3	-40	SALE	Consumo automático por orden #ORD-197021	\N	4	2026-09-16 06:46:39.95
14	4	-50	SALE	Consumo automático por orden #ORD-197021	\N	4	2026-09-16 06:46:39.954
15	6	-30	SALE	Consumo automático por orden #ORD-197021	\N	4	2026-09-16 06:46:39.958
16	1	-1	SALE	Consumo automático por orden #ORD-545093	\N	6	2026-09-17 05:40:40.266
17	2	-4	SALE	Consumo automático por orden #ORD-545093	\N	6	2026-09-17 05:40:40.289
18	3	-40	SALE	Consumo automático por orden #ORD-545093	\N	6	2026-09-17 05:40:40.292
19	4	-50	SALE	Consumo automático por orden #ORD-545093	\N	6	2026-09-17 05:40:40.296
20	6	-30	SALE	Consumo automático por orden #ORD-545093	\N	6	2026-09-17 05:40:40.298
21	1	-1	SALE	Consumo automático por orden #ORD-945882	\N	7	2026-09-17 05:46:16.056
22	2	-4	SALE	Consumo automático por orden #ORD-945882	\N	7	2026-09-17 05:46:16.072
23	3	-40	SALE	Consumo automático por orden #ORD-945882	\N	7	2026-09-17 05:46:16.076
24	4	-50	SALE	Consumo automático por orden #ORD-945882	\N	7	2026-09-17 05:46:16.08
25	6	-30	SALE	Consumo automático por orden #ORD-945882	\N	7	2026-09-17 05:46:16.084
\.


--
-- Data for Name: StoreSettings; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."StoreSettings" (id, "storeIsOpen", "scheduleDays", "openTime", "closeTime", "closedMessage", "whatsappNumber", "deliveryCost", "updatedAt") FROM stdin;
1	t	1,3,4,5,6,0	20:00	04:00	Hoy no abrimos, los esperamos en nuestro próximo día hábil con las mejores hamburguesas del Valle.	5493834974026	500.00	2026-09-17 06:12:32.18
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."User" (id, email, password, name, role, "createdAt", "updatedAt") FROM stdin;
1	admin@burgersosa.com	$2b$10$NRrTpirMablk.iaOfHNys.O3Q28uDrz.uyBhlQ2pX/T5bqTLH84G6	Admin Sosa	ADMIN	2026-09-16 04:02:19.144	2026-09-16 04:04:50.835
2	empleado@burgersosa.com	$2b$10$NRrTpirMablk.iaOfHNys.O3Q28uDrz.uyBhlQ2pX/T5bqTLH84G6	Empleado Juan	EMPLOYEE	2026-09-16 04:02:19.152	2026-09-16 04:04:50.847
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1bc4fd7e-0be1-48f9-8b96-4365aa4ea6ea	8737fa4c6e767cc616553d1f0e401cce495d9c674c01345e8104a8e2c98012a5	2026-09-16 04:02:00.899489+00	20260916040200_init	\N	\N	2026-09-16 04:02:00.860185+00	1
\.


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."Category_id_seq"', 8, true);


--
-- Name: Ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."Ingredient_id_seq"', 12, true);


--
-- Name: ModifierIngredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."ModifierIngredient_id_seq"', 2, true);


--
-- Name: Modifier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."Modifier_id_seq"', 4, true);


--
-- Name: OrderItemModifier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."OrderItemModifier_id_seq"', 7, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 11, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."Order_id_seq"', 7, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."Product_id_seq"', 14, true);


--
-- Name: RecipeItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."RecipeItem_id_seq"', 10, true);


--
-- Name: StockMovement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."StockMovement_id_seq"', 25, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."User_id_seq"', 4, true);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Ingredient Ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Ingredient"
    ADD CONSTRAINT "Ingredient_pkey" PRIMARY KEY (id);


--
-- Name: ModifierIngredient ModifierIngredient_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."ModifierIngredient"
    ADD CONSTRAINT "ModifierIngredient_pkey" PRIMARY KEY (id);


--
-- Name: Modifier Modifier_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Modifier"
    ADD CONSTRAINT "Modifier_pkey" PRIMARY KEY (id);


--
-- Name: OrderItemModifier OrderItemModifier_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."OrderItemModifier"
    ADD CONSTRAINT "OrderItemModifier_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: RecipeItem RecipeItem_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."RecipeItem"
    ADD CONSTRAINT "RecipeItem_pkey" PRIMARY KEY (id);


--
-- Name: StockMovement StockMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_pkey" PRIMARY KEY (id);


--
-- Name: StoreSettings StoreSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."StoreSettings"
    ADD CONSTRAINT "StoreSettings_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ModifierIngredient_modifierId_ingredientId_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "ModifierIngredient_modifierId_ingredientId_key" ON public."ModifierIngredient" USING btree ("modifierId", "ingredientId");


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: RecipeItem_productId_ingredientId_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "RecipeItem_productId_ingredientId_key" ON public."RecipeItem" USING btree ("productId", "ingredientId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: ModifierIngredient ModifierIngredient_ingredientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."ModifierIngredient"
    ADD CONSTRAINT "ModifierIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES public."Ingredient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ModifierIngredient ModifierIngredient_modifierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."ModifierIngredient"
    ADD CONSTRAINT "ModifierIngredient_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES public."Modifier"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Modifier Modifier_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Modifier"
    ADD CONSTRAINT "Modifier_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItemModifier OrderItemModifier_modifierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."OrderItemModifier"
    ADD CONSTRAINT "OrderItemModifier_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES public."Modifier"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItemModifier OrderItemModifier_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."OrderItemModifier"
    ADD CONSTRAINT "OrderItemModifier_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public."OrderItem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RecipeItem RecipeItem_ingredientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."RecipeItem"
    ADD CONSTRAINT "RecipeItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES public."Ingredient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RecipeItem RecipeItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."RecipeItem"
    ADD CONSTRAINT "RecipeItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockMovement StockMovement_ingredientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES public."Ingredient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockMovement StockMovement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 58XMkcfYwvAiPOyeMQfjFOlZmzKh1prrtXEKtrp1abSwOsu5iYK8xxjbIwg1Qyp

