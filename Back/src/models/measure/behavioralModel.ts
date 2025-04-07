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

export const selectChildObservation = async (uid: string): Promise<obser | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
                a.ABILITY_LABEL,
                i.ABILITY_LABEL_ID,
                i.GROUP_ID,
                i.GROUP_NUM,
                i.INFO
         FROM TB_ABILITY a
   INNER JOIN TB_ABILITY_INFO i
           ON a.ABILITY_ID = i.ABILITY_ID
          AND a.ABILITY_LABEL_ID = i.ABILITY_LABEL_ID
        WHERE i.GROUP_ID = CASE 
                           WHEN ? <= 35 THEN 'A' 
                           WHEN ? >= 54 THEN 'C' 
                           ELSE 'B' 
                           END`, 
      [uid]
  );
    conn.release();
    return rows.length ? rows : null;
};

export const upsertChildObservation = async (uid: string, abilityLabelId: string, questId: string, score: number): Promise<void> => {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        `
        INSERT INTO TB_OBSERVATION (
            uid,
            ability_label_id,
            quest_id,
            score,
            state
        ) VALUES (
            ?, ?, ?, ?, 1
        )
        ON DUPLICATE KEY UPDATE
        score = VALUES(score)
        `,
        [uid, abilityLabelId, questId, score]
      );
    } finally {
      conn.release();
    }
};
      
export const PR_Observation = async (uid: string): Promise<msgStatus> => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `CALL InsertChildAbilityObservation(?, 'A002')`,
      [uid]
    );

    return rows[0];
  } finally {
    conn.release();
  }
};
