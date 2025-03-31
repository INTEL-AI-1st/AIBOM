import pool from "@config/db";

interface info {
  nickName: string;
  profile: string;
  bio: string;
  agent: string;
}

export const selectInfo = async (uid: string): Promise<info | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
          u.NICK_NAME as nickName,
          u.AUTH_AGENT as agent, 
          p.profile,
          p.bio 
      FROM TB_USERS u
      LEFT JOIN TB_USER_PROFILES p ON u.UID = p.UID
      WHERE u.UID = ?`, 
      [uid]
  );
    conn.release();
    return rows.length ? rows[0] : null;
};

export const upsertProfile = async (uid: string, profile: string): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `
      INSERT INTO TB_USER_PROFILES (uid, profile)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        profile = VALUES(profile)
      `,
      [uid, profile]
    );
  } finally {
    conn.release();
  }
};

export const deleteProfile = async (uid: string): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE TB_USER_PROFILES SET profile = null WHERE UID = ?', [uid]);
  } finally {
    conn.release();
  }
};
  
export const updateInfo = async (uid: string, isPw: boolean, pw: string, nickName: string, bio: string): Promise<void> => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      if (isPw) {
        await conn.query(
          `
          UPDATE TB_USERS 
          SET NICK_NAME = ?,
              PASSWORD = SHA2(?, 256)
          WHERE UID = ?
          `,
          [nickName, pw, uid]
        );
      } else {
        await conn.query(
          `
          UPDATE TB_USERS 
          SET NICK_NAME = ?
          WHERE UID = ?
          `,
          [nickName, uid]
        );
      }

      await conn.query(
        `
        INSERT INTO TB_USER_PROFILES (UID, BIO)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          BIO = VALUES(BIO)
        `,
        [uid, bio]
      );
  
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  };