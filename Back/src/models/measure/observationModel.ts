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
            ability_label_id as abilityLabelId,
            quest_id as questId,
            score
        FROM TB_OBSERVATION
       WHERE UID = ?
         AND STATE = 1`, 
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
