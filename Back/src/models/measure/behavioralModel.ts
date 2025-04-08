import pool from "@config/db";

interface obser {
    abilityLabelId: string;
    questId: string;
    score: number;
}

interface msgStatus {
  state: string;
  msg: string;
}

export const selectAbility = async (uid: string, month: string): Promise<obser | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
                a.ABILITY_LABEL as abilityLabel,
                i.ABILITY_LABEL_ID as abilityLabelId,
                i.GROUP_ID as groupId,
                i.GROUP_NUM as groupNum,
                i.INFO as info,
                c.score,
                c.isMeas
         FROM TB_ABILITY a
   INNER JOIN TB_ABILITY_INFO i
           ON a.ABILITY_ID = i.ABILITY_ID
          AND a.ABILITY_LABEL_ID = i.ABILITY_LABEL_ID
    LEFT JOIN TB_CHILD_ABILITY c
    	   ON a.ABILITY_LABEL_ID = c.ABILITY_LABEL_ID
    	  AND a.ABILITY_LABEL_ID = i.ABILITY_LABEL_ID
    	  AND c.UID = ?
    	  AND c.RECORD_MONTH = CONCAT(YEAR(CURDATE()), '-', LPAD(MONTH(CURDATE()), 2, '0'))
        WHERE i.GROUP_ID = CASE 
                           WHEN ? <= 35 THEN 'A' 
                           WHEN ? >= 54 THEN 'C' 
                           ELSE 'B' 
                           END`, 
      [uid, month, month]
  );
    conn.release();
    return rows.length ? rows : null;
};

export const insertBehavioral = async (uid: string, abilityLabelId: string): Promise<void> => {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        `
        INSERT INTO TB_CHILD_ABILITY (
            uid,
            ability_id,
            ability_label_id,
            isMeas
        ) VALUES (
            ?, 'A001', ?, true
        )
        `,
        [uid, abilityLabelId]
      );
    } finally {
      conn.release();
    }
};