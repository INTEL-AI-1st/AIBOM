import pool from "@config/db";

export interface API {
  uuid: string;
  ai: number;
  apiKey: string;
}

export const selectAPI = async (uuid: string, ai: string): Promise<API | null> => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM TB_USERS_API WHERE UUID = ? AND AI = ?", [uuid, ai]);
  conn.release();
  return rows.length ? rows[0] : null;
};

export const createAPI = async (uuid: string, ai: string, apiKey: string): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    // 기존 레코드 조회
    const rows = await conn.query(
      "SELECT API_KEY FROM TB_USERS_API WHERE UUID = ? AND AI = ?",
      [uuid, ai]
    );
    if (rows.length > 0) {
      // 데이터가 이미 존재하는 경우
      if (rows[0].API_KEY !== apiKey) {
        if(apiKey !== ''){
          await conn.query(
            "UPDATE TB_USERS_API SET API_KEY = ? WHERE UUID = ? AND AI = ?",
            [apiKey, uuid, ai]
          );
        }else{
          await conn.query(
            "DELETE FROM TB_USERS_API WHERE UUID = ? AND AI = ?",
            [uuid, ai]
          );
        }
      }
    } else {
      // 데이터가 없으면 새로 삽입
      await conn.query(
        "INSERT INTO TB_USERS_API (UUID, AI, API_KEY) VALUES (?, ?, ?)",
        [uuid, ai, apiKey]
      );
    }
  } finally {
    conn.release();
  }
};

export const updateToggle = async (uuid: string, ai: string): Promise<void> => {
  const conn = await pool.getConnection();
  if(ai === ''){
    await conn.query("UPDATE TB_USERS_API SET CHECKED = false WHERE UUID = ?", [uuid]);
  }else{
    await conn.query(`
      UPDATE TB_USERS_API 
      SET CHECKED = CASE 
          WHEN AI = ? THEN true 
          ELSE false 
      END
      WHERE UUID = ?;
    `, [ai, uuid]);
  }
  
  conn.release();
};