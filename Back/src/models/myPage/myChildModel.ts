import pool from "@config/db";

interface child {
  name: string;
  birthday: string;
  gender: string;
  fileName: string;
 }

export const selectMyChild = async (uid: string): Promise<child | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
            c.uid,
            c.name,
            c.gender,
            CAST(TIMESTAMPDIFF(YEAR, c.birthday, CURDATE()) AS CHAR) AS ageYears,
            CAST(TIMESTAMPDIFF(MONTH, c.birthday, CURDATE()) AS CHAR) AS ageMonths,
            p.profile AS fileName
        FROM TB_USERS_CHILDS c
   LEFT JOIN TB_CHILD_PROFILES P
          ON C.UID = P.UID
       WHERE c.P_UID = ?`, 
      [uid]
  );
    conn.release();
    return rows.length ? rows : null;
};

export const PR_MyChild = async (uid: string, child: child): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query(
        `CALL AddChildProfile(?, ?, ?, ?, ?)`,
        [uid, child.name, child.birthday, child.gender, child.fileName]
    );
    conn.release();
};

export const deleteMyChild = async (uid: string): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query(
        `DELETE FROM TB_USERS_CHILDS WHERE UID = ?`,
        [uid]
    );
    conn.release();
};

export const upsertChildProfile = async (uid: string, fileName: string): Promise<void> => {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        `
        INSERT INTO TB_CHILD_PROFILES (uid, profile)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          profile = VALUES(profile)
        `,
        [uid, fileName]
      );
    } finally {
      conn.release();
    }
};

export const deleteChildProfile = async (uid: string): Promise<void> => {
    const conn = await pool.getConnection();
    try {
      await conn.query('DELETE FROM TB_CHILD_PROFILES WHERE uid = ?', [uid]);
    } finally {
      conn.release();
    }
};