# Query Timings

Each statement in [`04_queries.sql`](./04_queries.sql) was executed three times on PostgreSQL 17.2 using `EXPLAIN (ANALYZE, BUFFERS)`. Each run was enclosed in a transaction and rolled back after execution, including write statements, so the benchmark did not modify persistent data.

Benchmark data at run time: one existing user, one stock, one holding, and one order. Query 4 used a temporary rollback-only user because all existing users already have portfolios. Queries 5 and 6 used the concrete filters `A` and `Technology`.

| Query | Run 1 (ms) | Run 2 (ms) | Run 3 (ms) | Average (ms) |
| --- | ---: | ---: | ---: | ---: |
| [Query 1](./plans/query-01.txt) | 0.140 | 0.132 | 0.136 | 0.136 |
| [Query 2](./plans/query-02.txt) | 0.137 | 0.152 | 0.149 | 0.146 |
| [Query 3](./plans/query-03.txt) | 0.422 | 0.581 | 0.367 | 0.457 |
| [Query 4](./plans/query-04.txt) | 0.861 | 0.633 | 0.712 | 0.735 |
| [Query 5](./plans/query-05.txt) | 0.138 | 0.154 | 0.155 | 0.149 |
| [Query 6](./plans/query-06.txt) | 0.128 | 0.094 | 0.138 | 0.120 |
| [Query 7](./plans/query-07.txt) | 0.118 | 0.134 | 0.079 | 0.110 |
| [Query 8](./plans/query-08.txt) | 0.255 | 0.216 | 0.198 | 0.223 |
| [Query 9](./plans/query-09.txt) | 0.231 | 0.170 | 0.212 | 0.204 |
| [Query 10](./plans/query-10.txt) | 0.180 | 0.173 | 0.110 | 0.154 |
| [Query 11](./plans/query-11.txt) | 0.217 | 0.238 | 0.236 | 0.230 |
| [Query 12](./plans/query-12.txt) | 0.123 | 0.168 | 0.164 | 0.152 |
| [Query 13](./plans/query-13.txt) | 0.144 | 0.091 | 0.137 | 0.124 |
| [Query 14](./plans/query-14.txt) | 0.144 | 0.120 | 0.089 | 0.118 |
| [Query 15](./plans/query-15.txt) | 0.167 | 0.141 | 0.138 | 0.149 |
| [Query 16](./plans/query-16.txt) | 0.357 | 0.176 | 0.202 | 0.245 |
| [Query 17](./plans/query-17.txt) | 0.190 | 0.112 | 0.191 | 0.164 |
| [Query 18](./plans/query-18.txt) | 0.190 | 0.203 | 0.191 | 0.195 |
| [Query 19](./plans/query-19.txt) | 0.171 | 0.150 | 0.148 | 0.156 |
| [Query 20](./plans/query-20.txt) | 0.176 | 0.186 | 0.171 | 0.178 |
| [Query 21](./plans/query-21.txt) | 1.315 | 1.509 | 0.851 | 1.225 |
| [Query 22](./plans/query-22.txt) | 0.448 | 0.183 | 0.170 | 0.267 |

Plans are stored in [`dbms/plans/`](./plans/), one file per query with all three runs.
