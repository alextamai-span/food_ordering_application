# Food Ordering Application Architecture

This is a cleaned, high-level architecture view of the current codebase. It keeps the real layering and major flows, but removes low-value visual noise.

```mermaid
flowchart TD
    classDef frontend fill:#d1e9ff,stroke:#333,stroke-width:1px
    classDef auth fill:#ffe5d1,stroke:#333,stroke-width:1px
    classDef backend fill:#d1ffd1,stroke:#333,stroke-width:1px
    classDef data fill:#e9d1ff,stroke:#333,stroke-width:1px
    classDef infra fill:#fff5cc,stroke:#333,stroke-width:1px

    FE0[Frontend Pages + Components] --> FE1[Frontend Services]
    FE2[Redux authSlice] --> FE1

    FE1 --> AU0["Public Auth Calls <br/> POST /register, POST /login"]
    FE1 --> AU1["Protected API Calls <br/> Bearer Token"]

    AU0 --> R0[registerRoute + loginRoute]
    AU1 --> AJ[verifyJWT middleware]
    AJ --> R1[accountRoute]
    AJ --> R2[cartRoute]
    AJ --> R3[guestMenuRoutes]
    AJ --> R4[empMenuRoutes]
    AJ --> R5[guestOrderRoutes]
    AJ --> R6[empOrderRoutes]

    subgraph L0[Backend Bootstrap]
        direction LR
        I0[config/fastify.ts]
        I1["Plugins <br/> Postgres, CORS, JWT, Swagger"]
        I2[server.ts registers routes]
        I3[tableQueries.ts initializes tables]
        I0 --> I1 --> I2 --> I3
    end

    subgraph L1[Controller Layer]
        direction LR
        C0[RegisterController]
        C1[LoginController]
        C2[AccountController]
        C3[CartController]
        C4[GuestMenuController]
        C5[EmpMenuController]
        C6[GuestOrderController]
        C7[EmpOrderController]
    end

    subgraph L2[Service Layer]
        direction LR
        S0[registerService]
        S1[loginService]
        S2[accountService]
        S3[cartService]
        S4[guestMenuService]
        S5[empMenuService]
        S6[guestOrderService]
        S7[empOrderService]
    end

    subgraph L3[Repository Layer]
        direction LR
        P0[registerRepository]
        P1[loginRepository]
        P2[accountRepository]
        P3[cartRepository]
        P4[guestMenuRepository]
        P5[empMenuRepository]
        P6[guestOrderRepository]
        P7[empOrderRepository]
    end

    subgraph L4[Query Module Layer]
        direction LR
        Q0[registerQueries]
        Q1[loginQueries]
        Q2[accountQueries]
        Q3[cartQueries]
        Q4[menuQueries]
        Q5[orderQueries]
    end

    subgraph DB[PostgreSQL Tables]
        direction LR
        DB0[(users)]
        DB1[(menu_items)]
        DB2[(orders)]
        DB3[(cart_items)]
    end

    R0 --> C0
    R0 --> C1
    R1 --> C2
    R2 --> C3
    R3 --> C4
    R4 --> C5
    R5 --> C6
    R6 --> C7

    C0 --> S0 --> P0 --> Q0 --> DB0
    C1 --> S1 --> P1 --> Q1 --> DB0
    C2 --> S2 --> P2 --> Q2 --> DB0
    C3 --> S3 --> P3 --> Q3 --> DB3
    C4 --> S4 --> P4 --> Q4 --> DB1
    C5 --> S5 --> P5 --> Q4 --> DB1
    C6 --> S6 --> P6 --> Q5 --> DB2
    C7 --> S7 --> P7 --> Q5 --> DB2

    Q3 --> DB0
    Q3 --> DB1
    Q5 --> DB0
    Q5 --> DB1
    I3 --> DB0
    I3 --> DB1
    I3 --> DB2
    I3 --> DB3

    class FE0,FE1,FE2 frontend
    class AU0,AU1,AJ auth
    class R0,R1,R2,R3,R4,R5,R6,C0,C1,C2,C3,C4,C5,C6,C7,S0,S1,S2,S3,S4,S5,S6,S7,P0,P1,P2,P3,P4,P5,P6,P7,Q0,Q1,Q2,Q3,Q4,Q5 backend
    class DB0,DB1,DB2,DB3 data
    class I0,I1,I2,I3 infra
```

## Notes

- Kept accurate architecture layers while reducing edge count for readability.
- Core backend pattern is route -> controller -> service -> repository -> query -> database.
- Protected groups use verifyJWT; register and login stay public.
- Startup schema currently initializes users, menu_items, orders, and cart_items.
- accountPopUp still fetches profile data through empService.fetchUserData, while account lookup logic now lives under accountRoute.