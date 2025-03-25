import pool from "@config/db";

export interface info {
  nickName: string;
  profile: string;
  bio: string;
  agent: string;
}

export const selectInfo = async (uuid: string): Promise<info | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
          u.NICK_NAME as nickName,
          u.AUTH_AGENT as agent, 
          p.profile,
          p.bio 
      FROM TB_USERS u
      LEFT JOIN TB_USER_PROFILES p ON u.UUID = p.UUID
      WHERE u.UUID = ?`, 
      [uuid]
  );
    conn.release();
    return rows.length ? rows[0] : null;
};

export const upsertProfile = async (uuid: string, profile: string): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `
      INSERT INTO TB_USER_PROFILES (uuid, profile)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        profile = VALUES(profile)
      `,
      [uuid, profile]
    );
  } finally {
    conn.release();
  }
};

export const deleteProfile = async (uuid: string): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE TB_USER_PROFILES SET profile = null WHERE UUID = ?', [uuid]);
  } finally {
    conn.release();
  }
};
  
export const updateInfo = async (uuid: string, isPw: boolean, pw: string, nickName: string, bio: string): Promise<void> => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      if (isPw) {
        await conn.query(
          `
          UPDATE TB_USERS 
          SET NICK_NAME = ?,
              PASSWORD = SHA2(?, 256)
          WHERE UUID = ?
          `,
          [nickName, pw, uuid]
        );
      } else {
        await conn.query(
          `
          UPDATE TB_USERS 
          SET NICK_NAME = ?
          WHERE UUID = ?
          `,
          [nickName, uuid]
        );
      }

      await conn.query(
        `
        INSERT INTO TB_USER_PROFILES (UUID, BIO)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          BIO = VALUES(BIO)
        `,
        [uuid, bio]
      );
  
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  };