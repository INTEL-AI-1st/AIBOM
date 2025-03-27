import pool from "@config/db";

export interface graph {
    ablId: string;
    ablName: string;
    ablLabId: string;
    ablLab: string;
    rcdId: string;
    score: number;
    avgScore: number;
   }

   export const selectChildGraph = async (uid: string): Promise<graph | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
           a.ability_id AS ablId,
           a.ability_name AS ablName,
           a.ability_label_id AS ablLabId,
           a.ability_label AS ablLab,
           c.record_id AS rcdId,
           c.score,
           avg_tbl.avgScore
       FROM TB_Ability AS a
   LEFT JOIN (
           SELECT 
               ability_id,
               ability_label_id,
               ROUND(AVG(score), 2) AS avgScore
            FROM TB_CHILD_Ability
           WHERE record_month = DATE_FORMAT(NOW(), '%Y-%m')
        GROUP BY ability_id, ability_label_id
           ) AS avg_tbl
         ON a.ability_id = avg_tbl.ability_id
        AND a.ability_label_id = avg_tbl.ability_label_id
   LEFT JOIN TB_CHILD_Ability AS c
         ON c.ability_id = a.ability_id
        AND c.ability_label_id = a.ability_label_id
        AND c.uid = ?
        AND c.record_month = DATE_FORMAT(NOW(), '%Y-%m')`,
      [uid]
    );
    conn.release();
  
    // BigInt 값을 문자열로 변환
    const safeRows = rows.map((row: any) => {
      for (const key in row) {
        if (typeof row[key] === 'bigint') {
          row[key] = row[key].toString();
        }
      }
      return row;
    });
  
    return safeRows.length ? safeRows : null;
  };
  