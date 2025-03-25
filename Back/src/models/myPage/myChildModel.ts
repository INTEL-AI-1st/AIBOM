import pool from "@config/db";

export interface child {
  name: string;
  birthday: string;
  gender: string;
 }

export const selectMyChild = async (uid: string): Promise<child | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
            c.name,
            CAST(TIMESTAMPDIFF(YEAR, c.birthday, CURDATE()) AS CHAR) AS ageYears,
            CAST(TIMESTAMPDIFF(MONTH, c.birthday, CURDATE()) AS CHAR) AS ageMonths
      FROM TB_USERS_CHILDS c
      WHERE c.P_UID = ?`, 
      [uid]
  );
    conn.release();
    return rows.length ? rows : null;
};

export const saveMyChild = async (uid: string, child: child): Promise<void> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `INSERT INTO TB_USERS_CHILDS (p_uid, name, birthday, gender)
      VALUES (?, ?, ?, ?)`, 
      [uid, child.name, child.birthday, child.gender]
  );
    conn.release();
};