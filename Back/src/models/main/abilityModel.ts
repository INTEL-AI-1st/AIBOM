import pool from "@config/db";

interface graph {
    ablId: string;
    ablName: string;
    explan: string;
    ablLabId: string;
    ablLab: string;
    rcdId: string;
    score: number;
    avgScore: number;
    status: string;
}

   export const selectChildGraph = async (uid: string, age: string): Promise<graph | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        `WITH ranked_child_ability AS (
            SELECT 
                c.*,
                ROW_NUMBER() OVER (
                    PARTITION BY c.ability_id, c.ability_label_id 
                    ORDER BY (c.record_month = DATE_FORMAT(NOW(), '%Y-%m')) DESC, c.record_month DESC
                ) AS rn,
                CASE 
                    WHEN c.record_month = DATE_FORMAT(NOW(), '%Y-%m') THEN '1'
                    ELSE '2'
                END AS status
            FROM TB_CHILD_Ability c
            WHERE c.uid = ?
            AND c.isMeas = 0
            ),
        base_data AS (
            SELECT 
                a.ability_id         AS ablId,
                a.ability_name       AS ablName,
                a.explan,
                a.ability_label_id   AS ablLabId,
                a.ability_label      AS ablLab,
                rc.record_id         AS rcdId,
                rc.score,
                COALESCE(avg_tbl2.avgScore, avg_tbl.avgScore) AS avgScore,
                IFNULL(rc.status, '0') AS status
            FROM TB_Ability a
            LEFT JOIN (
                SELECT 
                    ability_id,
                    ability_label_id,
                    ROUND(AVG(score), 2) AS avgScore
                FROM TB_CHILD_Ability
                GROUP BY ability_id, ability_label_id
            ) AS avg_tbl
            ON a.ability_id = avg_tbl.ability_id 
            AND a.ability_label_id = avg_tbl.ability_label_id
            LEFT JOIN (
                SELECT 
                    ability_id,
                    ability_label_id,
                    ROUND(AVG(score), 2) AS avgScore
                FROM tb_avg_ability
                WHERE age = CASE 
                                WHEN ? <= 3 THEN 3 
                                WHEN ? = 4 THEN 4 
                                ELSE 5 
                            END
                AND gender = 0         
                GROUP BY ability_id, ability_label_id
            ) AS avg_tbl2
            ON a.ability_id = avg_tbl2.ability_id
            AND a.ability_label_id = avg_tbl2.ability_label_id
            LEFT JOIN ranked_child_ability AS rc
            ON a.ability_id = rc.ability_id
            AND a.ability_label_id = rc.ability_label_id
            AND rc.rn = 1
        ),
        agg_status AS (
            SELECT 
                ablId,
                CASE 
                    WHEN SUM(CASE WHEN status = '0' THEN 1 ELSE 0 END) > 0 THEN '0'
                    WHEN COUNT(*) = SUM(CASE WHEN status = '1' THEN 1 ELSE 0 END) THEN '1'
                    ELSE '2'
                END AS final_status
            FROM base_data
            GROUP BY ablId
        )
        SELECT 
            bd.ablId,
            bd.ablName,
            bd.explan,
            bd.ablLabId,
            bd.ablLab,
            bd.rcdId,
            bd.score,
            bd.avgScore,
            ag.final_status AS status
        FROM base_data bd
        JOIN agg_status ag 
            ON bd.ablId = ag.ablId;
`,
      [uid, age, age]
    );
    conn.release();

    return rows.length ? rows : null;
  };
  