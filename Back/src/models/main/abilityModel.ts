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

   export const selectChildGraph = async (uid: string): Promise<graph | null> => {
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
        )
        SELECT 
        a.ability_id         AS ablId,
        a.ability_name       AS ablName,
        a.explan,
        a.ability_label_id   AS ablLabId,
        a.ability_label      AS ablLab,
        rc.record_id         AS rcdId,
        rc.score,
        avg_tbl.avgScore,
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
        LEFT JOIN ranked_child_ability AS rc
        ON a.ability_id = rc.ability_id
        AND a.ability_label_id = rc.ability_label_id
        AND rc.rn = 1`,
      [uid]
    );
    conn.release();

    return rows.length ? rows : null;
  };
  